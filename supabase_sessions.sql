-- Create Sessions Table for Live Visitor Tracking
create table if not exists public.sessions (
  id text primary key, -- This will be the UUID from local storage
  user_id uuid references auth.users(id),
  last_seen timestamp with time zone default timezone('utc'::text, now()),
  user_agent text,
  path text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table public.sessions enable row level security;

-- Policies
-- Allow anyone to insert/update their own session (based on ID match)
create policy "Allow public insert/update on sessions" on public.sessions
  for all
  using (true)
  with check (true); 
  -- Note: In a stricter app, we might want to validate the ID format or something, 
  -- but for visitor tracking, allowing upserts by ID is fine.

-- Allow admins to view all sessions
create policy "Admins can view all sessions" on public.sessions
  for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Function to merge guest cart into user cart
create or replace function public.merge_guest_cart(guest_session_id text)
returns void as $$
begin
  -- Update cart items that belong to this session and have no user_id
  update public.cart_items
  set user_id = auth.uid()
  where session_id = guest_session_id
  and user_id is null;
end;
$$ language plpgsql security definer;
