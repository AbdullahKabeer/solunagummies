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

  // 2. Initialize Supabase Admin Client (Service Role) to bypass RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { items, amount, paymentIntentId, email, shippingDetails } = await request.json();

    // 3. Create Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user?.id || null,
        stripe_payment_intent_id: paymentIntentId,
        amount: amount / 100, // Convert cents to dollars
        status: 'paid',
        shipping_details: { ...shippingDetails, email },
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Create Order Items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id || item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    // 5. Clear Cart (only if user is logged in)
    if (user) {
      await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
