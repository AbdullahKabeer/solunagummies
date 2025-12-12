'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { createClient } from '@/lib/supabase/client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAnalytics } from '@/hooks/useAnalytics';

interface SessionContextType {
  sessionId: string;
  visitorId: string;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string>('');
  const [visitorId, setVisitorId] = useState<string>('');
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { track } = useAnalytics();

  // Helper to set cookie
  const setCookie = (name: string, value: string, days: number) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  // Helper to get cookie
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  // 1. Initialize Session ID & Visitor ID
  useEffect(() => {
    // Visitor ID (1 year)
    let vid = getCookie('soluna_visitor_id');
    if (!vid) {
      vid = crypto.randomUUID();
      setCookie('soluna_visitor_id', vid, 365);
    }
    setVisitorId(vid);

    // Session ID (30 mins)
    let sid = getCookie('soluna_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      // Store landing page and referrer only on first session creation
      sessionStorage.setItem('soluna_landing_page', window.location.pathname);
      sessionStorage.setItem('soluna_referrer', document.referrer);
      
      // Capture UTMs
      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const utmCampaign = searchParams.get('utm_campaign');
      if (utmSource) sessionStorage.setItem('utm_source', utmSource);
      if (utmMedium) sessionStorage.setItem('utm_medium', utmMedium);
      if (utmCampaign) sessionStorage.setItem('utm_campaign', utmCampaign);
    }
    // Refresh session cookie expiration on activity
    setCookie('soluna_session_id', sid, 0.0208); // 30 mins = 0.0208 days
    setSessionId(sid);

  }, [searchParams]);

  // 2. Track Page Views & Heartbeat
  useEffect(() => {
    if (!sessionId) return;

    // Track Page View on path change
    track('page_view', {}, { sessionId, visitorId });

    const updateHeartbeat = async () => {
      try {
        await supabase.from('sessions').upsert({
          id: sessionId,
          visitor_id: visitorId,
          last_seen: new Date().toISOString(),
          path: pathname,
          user_agent: navigator.userAgent,
        }, { onConflict: 'id' });
      } catch (error) {
        console.error('Error updating session heartbeat:', error);
      }
    };

    // Initial heartbeat
    updateHeartbeat();

    // Heartbeat every 30 seconds
    const interval = setInterval(updateHeartbeat, 30000);

    return () => clearInterval(interval);
  }, [sessionId, visitorId, pathname, track]);

  // 3. Merge Cart on Login
  useEffect(() => {
    if (user && sessionId) {
      const mergeCart = async () => {
        try {
          await supabase.rpc('merge_guest_cart', {
            guest_session_id: sessionId,
          });
          console.log('Merged guest cart for session:', sessionId);
        } catch (error) {
          console.error('Error merging cart:', error);
        }
      };
      mergeCart();
    }
  }, [user, sessionId]);

  // 4. Handle Tab Close (Immediate Offline Status)
  useEffect(() => {
    const handleUnload = () => {
      if (!sessionId) return;
      
      // We use fetch with keepalive: true to ensure the request is sent even if the tab closes
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/sessions?id=eq.${sessionId}`;
      const headers = {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      };
      
      // Set last_seen to 1 hour ago to immediately mark as inactive in the dashboard
      const data = JSON.stringify({ 
        last_seen: new Date(Date.now() - 60 * 60 * 1000).toISOString() 
      });

      fetch(url, {
        method: 'PATCH',
        headers,
        body: data,
        keepalive: true
      }).catch(console.error);
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [sessionId]);

  return (
    <SessionContext.Provider value={{ sessionId, visitorId }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
