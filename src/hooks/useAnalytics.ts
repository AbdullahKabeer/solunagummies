'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

export const useAnalytics = () => {
  const pathname = usePathname();

  const track = useCallback(async (eventName: string, properties: any = {}) => {
    try {
      const sessionId = localStorage.getItem('soluna_session_id');
      // We don't strictly need user_id here as the server can infer it or we can pass it if available
      // For now, we rely on session_id which is the most critical for guest tracking
      
      await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventName,
          properties,
          session_id: sessionId,
          url: window.location.href,
        }),
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }, []);

  return { track };
};
