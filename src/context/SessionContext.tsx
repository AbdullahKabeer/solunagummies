'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { createClient } from '@/lib/supabase/client';
import { usePathname } from 'next/navigation';

interface SessionContextType {
  sessionId: string;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string>('');
  const { user } = useAuth();
  const pathname = usePathname();
  const supabase = createClient();

  // 1. Initialize Session ID
  useEffect(() => {
    let sid = localStorage.getItem('soluna_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('soluna_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  // 2. Heartbeat & Tracking
  useEffect(() => {
    if (!sessionId) return;

    const updateSession = async () => {
      try {
        await supabase.from('sessions').upsert({
          id: sessionId,
          user_id: user?.id || null,
          last_seen: new Date().toISOString(),
          path: pathname,
          user_agent: window.navigator.userAgent,
        });
      } catch (error) {
        console.error('Error updating session:', error);
      }
    };

    // Initial update
    updateSession();

    // Heartbeat every 30 seconds
    const interval = setInterval(updateSession, 30000);

    return () => clearInterval(interval);
  }, [sessionId, user, pathname]);

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
    <SessionContext.Provider value={{ sessionId }}>
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
