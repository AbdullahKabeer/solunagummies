import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as any,
});

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const calculateOrderAmount = async (items: any[]) => {
  let total = 0;

  // Fetch all products to verify prices
  const { data: products } = await supabaseAdmin.from('products').select('sku, price, compare_at_price');

  if (!products) {
    throw new Error('Could not fetch products for price verification');
  }

  for (const item of items) {
    const product = products.find((p: any) => p.sku === item.sku);
    
    if (product) {
      // Use server-side price
      total += product.price * item.quantity;
    } else {
      // Fallback for dynamic bundles or missing SKUs (Should be avoided in production)
      // For now, we will log a warning and use the client price, BUT this is risky.
      // Better approach: Define all SKUs in DB.
      console.warn(`Price verification failed for SKU: ${item.sku}. Using client price: ${item.price}`);
      
      // STRICT MODE: Uncomment to reject invalid SKUs
      // throw new Error(`Invalid Product SKU: ${item.sku}`);
      
      // LENIENT MODE (for development/demos):
      total += item.price * item.quantity;
    }
  }

  return Math.round(total * 100);
};

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    const amount = await calculateOrderAmount(items);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Payment Intent Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
