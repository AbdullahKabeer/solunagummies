-- FIX RLS POLICIES FOR GUEST CARTS (FINAL)
-- Run this script in your Supabase SQL Editor to fix the "new row violates row-level security policy" error.

-- 1. Ensure the table structure is correct
alter table public.cart_items add column if not exists session_id text;
alter table public.cart_items alter column user_id drop not null;

-- 2. Enable RLS
alter table public.cart_items enable row level security;

-- 3. Drop OLD policies to avoid conflicts
drop policy if exists "Users can view their own cart items" on public.cart_items;
drop policy if exists "Users can insert their own cart items" on public.cart_items;
drop policy if exists "Users can update their own cart items" on public.cart_items;
drop policy if exists "Users can delete their own cart items" on public.cart_items;

-- 4. Create NEW policies that check for x-session-id header
create policy "Users can view their own cart items" on public.cart_items for select using (
  (auth.uid() = user_id) or (session_id = current_setting('request.headers', true)::json->>'x-session-id')
);

create policy "Users can insert their own cart items" on public.cart_items for insert with check (
  (auth.uid() = user_id) or (session_id = current_setting('request.headers', true)::json->>'x-session-id')
);

create policy "Users can update their own cart items" on public.cart_items for update using (
  (auth.uid() = user_id) or (session_id = current_setting('request.headers', true)::json->>'x-session-id')
);

create policy "Users can delete their own cart items" on public.cart_items for delete using (
  (auth.uid() = user_id) or (session_id = current_setting('request.headers', true)::json->>'x-session-id')
);

-- 5. Grant access to anonymous users (if not already granted)
grant all on public.cart_items to anon;
grant all on public.cart_items to authenticated;
