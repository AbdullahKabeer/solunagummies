import { createBrowserClient } from '@supabase/ssr';

export function createClient(options?: { headers?: Record<string, string> }) {
  if (options?.headers) {
    console.log('Creating Supabase client with headers:', options.headers);
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      global: {
        headers: options?.headers,
      },
    }
  );
}
