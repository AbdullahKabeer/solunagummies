'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

export const useAnalytics = () => {
  const pathname = usePathname();

  const track = useCallback(async (eventName: string, properties: any = {}, options?: { sessionId?: string, visitorId?: string }) => {
    try {
      const sessionId = options?.sessionId || localStorage.getItem('soluna_session_id') || getCookie('soluna_session_id');
      const visitorId = options?.visitorId || getCookie('soluna_visitor_id');
      
      if (!sessionId) {
        console.warn('No session ID found for tracking');
        return;
      }

      await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventName,
          properties,
          session_id: sessionId,
          visitor_id: visitorId,
          url: window.location.href,
        }),
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }, []);

  return { track };
};

// Helper to get cookie (duplicated to avoid circular deps)
function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
