import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Initialize Supabase Admin Client to bypass RLS for reliable logging
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_name, properties, session_id, visitor_id, user_id, url } = body;
    
    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const headersList = await headers();

    // Extract Geo & Device Info from Headers (Vercel/Next.js specific + Custom Middleware)
    const ip = headersList.get('x-ip') || headersList.get('x-forwarded-for') || 'unknown';
    const country = headersList.get('x-geo-country') || headersList.get('x-vercel-ip-country') || 'unknown';
    const city = headersList.get('x-geo-city') || headersList.get('x-vercel-ip-city') || 'unknown';
    const region = headersList.get('x-geo-region') || headersList.get('x-vercel-ip-region') || 'unknown';
    const deviceType = headersList.get('x-device-type') || 'Desktop';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // 1. Ensure Session Exists (Upsert)
    // This prevents foreign key errors if the session was cleared from DB but cookie remains
    const { error: sessionError } = await supabaseAdmin
      .from('sessions')
      .upsert({
        id: session_id,
        visitor_id: visitor_id || null, // Handle missing visitor_id
        last_seen: new Date().toISOString(),
        ip_address: ip,
        country,
        city,
        region,
        device_type: deviceType,
        user_agent: userAgent,
      }, { onConflict: 'id' });

    if (sessionError) {
      console.error('Error creating/updating session:', sessionError);
      // If session creation fails, we can't log the event due to FK constraint
      return NextResponse.json({ error: 'Failed to create session', details: sessionError }, { status: 500 });
    }

    // 2. Log the Event
    const { error: eventError } = await supabaseAdmin
      .from('analytics_events')
      .insert({
        session_id,
        visitor_id: visitor_id || null,
        user_id: user_id || null,
        event_name,
        properties,
        url,
      });

    if (eventError) throw eventError;

    // 3. Populate Specific Analytics Tables (Enterprise Analytics V3)
    if (event_name === 'page_view') {
      await supabaseAdmin.from('page_views').insert({
        session_id,
        visitor_id: visitor_id || null,
        url,
        path: new URL(url).pathname,
        title: properties?.title,
        referrer: properties?.referrer,
      });
    } else if (event_name === 'add_to_cart' || event_name === 'remove_from_cart') {
      await supabaseAdmin.from('cart_events').insert({
        session_id,
        visitor_id: visitor_id || null,
        event_type: event_name === 'add_to_cart' ? 'add' : 'remove',
        product_id: properties?.product_id,
        sku: properties?.sku,
        product_name: properties?.name,
        quantity: properties?.quantity,
        unit_price: properties?.price,
        total_value: (properties?.price || 0) * (properties?.quantity || 1),
        cart_total: properties?.cart_total, // Ensure client sends this
      });
    } else if (event_name === 'begin_checkout') {
      await supabaseAdmin.from('checkout_events').insert({
        session_id,
        visitor_id: visitor_id || null,
        step: 'initiated',
        cart_value: properties?.value,
        item_count: properties?.item_count,
      });
    } else if (event_name === 'purchase') {
      await supabaseAdmin.from('checkout_events').insert({
        session_id,
        visitor_id: visitor_id || null,
        step: 'completed',
        cart_value: properties?.value,
        item_count: properties?.item_count,
      });
    } else if (event_name === 'view_item') {
      await supabaseAdmin.from('product_views').insert({
        session_id,
        visitor_id: visitor_id || null,
        product_id: properties?.product_id,
        sku: properties?.sku,
        product_name: properties?.name,
        price_shown: properties?.price,
      });
    }

    // 4. Update Session with UTM info if it's a page_view or session_start
    if (event_name === 'page_view' || event_name === 'session_start') {
      // Parse UTM from URL
      const urlObj = new URL(url);
      const utm_source = urlObj.searchParams.get('utm_source');
      const utm_medium = urlObj.searchParams.get('utm_medium');
      const utm_campaign = urlObj.searchParams.get('utm_campaign');

      if (utm_source || utm_medium || utm_campaign) {
        const updateData: any = {};
        if (utm_source) updateData.utm_source = utm_source;
        if (utm_medium) updateData.utm_medium = utm_medium;
        if (utm_campaign) updateData.utm_campaign = utm_campaign;

        await supabaseAdmin
          .from('sessions')
          .update(updateData)
          .eq('id', session_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
