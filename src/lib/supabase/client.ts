import { createBrowserClient } from '@supabase/ssr';

let browserClient:
  | ReturnType<typeof createBrowserClient>
  | null = null;

export function createClient(options?: { headers?: Record<string, string> }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  // If callers explicitly provide headers, return a new client so headers don't
  // leak globally across the app.
  if (options?.headers) {
    return createBrowserClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: options.headers,
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return browserClient;
}
