import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function POST(request: Request) {
  // 1. Get the user from the session (if logged in)
  const cookieStore = await cookies();
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  const { data: { user } } = await supabaseAuth.auth.getUser();
  const visitorId = cookieStore.get('soluna_visitor_id')?.value || null;

  // 2. Initialize Supabase Admin Client (Service Role) to bypass RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { items, amount, paymentIntentId, email, shippingDetails, sessionId } = await request.json();

    // Calculate Financials
    const totalAmount = amount / 100; // Convert cents to dollars
    let subtotalPrice = 0;
    
    items.forEach((item: any) => {
      subtotalPrice += (item.price * item.quantity);
    });

    // Simple estimation (In a real app, these should come from the payment provider or tax service)
    const totalShipping = totalAmount > subtotalPrice ? (totalAmount - subtotalPrice) : 0; 
    const totalTax = 0; // Placeholder
    const totalDiscounts = 0; // Placeholder
    const netSales = subtotalPrice - totalDiscounts;

    // 2.5 Find or Create Customer
    let customerId = null;
    if (email) {
      const { data: existingCustomer } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('email', email)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
        // Link auth user if logged in
        if (user?.id) {
             await supabaseAdmin.from('customers').update({ auth_user_id: user.id }).eq('id', customerId);
        }
      } else {
        const { data: newCustomer, error: createCustomerError } = await supabaseAdmin
          .from('customers')
          .insert({
            email: email,
            first_name: shippingDetails?.name?.split(' ')[0] || '',
            last_name: shippingDetails?.name?.split(' ').slice(1).join(' ') || '',
            auth_user_id: user?.id || null,
            accepts_marketing: true 
          })
          .select('id')
          .single();
        
        if (!createCustomerError && newCustomer) {
          customerId = newCustomer.id;
        }
      }
    }

    // 3. Create Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user?.id || null,
        customer_id: customerId, // Link to CRM Customer
        session_id: sessionId || null,
        visitor_id: visitorId, 
        stripe_payment_intent_id: paymentIntentId,
        amount: totalAmount,
        subtotal_price: subtotalPrice, 
        total_tax: totalTax, 
        total_shipping: totalShipping, 
        total_discounts: totalDiscounts, 
        net_sales: netSales, 
        status: 'paid',
        shipping_details: { ...shippingDetails, email },
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Create Order Items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => {
        // Determine COGS based on product
        // This is a hardcoded mapping for now. Ideally, fetch from a 'products' table.
        let costPerItem = 0;
        
        // Use the SKU passed from the cart, or fallback to a default
        const sku = item.sku || 'UNKNOWN';

        if (item.name.includes('Focus Protocol')) {
            let baseCost = 25.00; // Estimated COGS per bottle
            let bundleSize = 1;

            // Parse bundle size from SKU (e.g., FG3S -> 3)
            // For One-time (FG1O), bundleSize is 1, but quantity handles the multiplier.
            // For Subscription (FG3S), bundleSize is 3, quantity is 1.
            if (sku.startsWith('FG')) {
                const sizeChar = sku.charAt(2);
                const parsedSize = parseInt(sizeChar);
                if (!isNaN(parsedSize)) {
                    bundleSize = parsedSize;
                }
            }
            
            costPerItem = baseCost * bundleSize;
        }

        return {
            order_id: order.id,
            product_id: item.id || item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            cost_per_item: costPerItem, // New Field
            sku: sku, // New Field
        };
      });

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    // 5. Clear Cart
    if (user) {
      await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
    } else if (sessionId) {
      await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId);
    }

    // 6. Update Session Conversion
    if (sessionId) {
      await supabaseAdmin
        .from('sessions')
        .update({
          converted_at: new Date().toISOString(),
          last_order_id: order.id
        })
        .eq('id', sessionId);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
