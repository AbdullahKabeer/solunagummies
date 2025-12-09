-- Add session_id to orders table
alter table public.orders add column if not exists session_id text;

-- Update RLS policies for orders to allow access by session_id (optional, but good for guest order tracking page)
-- For now, we just store it.
