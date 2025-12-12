-- Add missing columns to the sessions table
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS ip_address TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS device_type TEXT;

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
