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

    // 3. Update Session with UTM info if it's a page_view or session_start
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
