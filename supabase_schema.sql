-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles Table (Public user data)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add columns if they don't exist (safe for existing tables)
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists role text default 'customer';

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policies for profiles
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Orders Table
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  stripe_payment_intent_id text,
  amount decimal,
  status text default 'pending', -- pending, paid, fulfilled, cancelled
  shipping_details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Policies for orders
drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders" on public.orders for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders" on public.orders for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Users can insert their own orders" on public.orders;
create policy "Users can insert their own orders" on public.orders for insert with check (auth.uid() = user_id);

-- Order Items Table
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders on delete cascade,
  product_id text,
  name text,
  quantity int,
  price decimal
);

-- Enable RLS on order_items
alter table public.order_items enable row level security;

-- Policies for order_items
drop policy if exists "Users can view their own order items" on public.order_items;
create policy "Users can view their own order items" on public.order_items for select using (
  exists (select 1 from public.orders where id = public.order_items.order_id and user_id = auth.uid())
);

drop policy if exists "Admins can view all order items" on public.order_items;
create policy "Admins can view all order items" on public.order_items for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Users can insert their own order items" on public.order_items;
create policy "Users can insert their own order items" on public.order_items for insert with check (
  exists (select 1 from public.orders where id = public.order_items.order_id and user_id = auth.uid())
);

-- Cart Items Table (Ensure policies exist)
create table if not exists public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  product_id text,
  name text,
  price decimal,
  quantity int,
  image text,
  subscription boolean,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add session_id column and make user_id nullable
alter table public.cart_items add column if not exists session_id text;
alter table public.cart_items alter column user_id drop not null;

alter table public.cart_items enable row level security;

-- Policies for cart_items (Updated for Guest Access)
drop policy if exists "Users can view their own cart items" on public.cart_items;
create policy "Users can view their own cart items" on public.cart_items for select using (
  (auth.uid() = user_id) or (session_id = current_setting('request.headers', true)::json->>'x-session-id')
);

drop policy if exists "Users can insert their own cart items" on public.cart_items;
create policy "Users can insert their own cart items" on public.cart_items for insert with check (
  (auth.uid() = user_id) or (session_id = current_setting('request.headers', true)::json->>'x-session-id')
);

drop policy if exists "Users can update their own cart items" on public.cart_items;
create policy "Users can update their own cart items" on public.cart_items for update using (
  (auth.uid() = user_id) or (session_id = current_setting('request.headers', true)::json->>'x-session-id')
);

drop policy if exists "Users can delete their own cart items" on public.cart_items;
create policy "Users can delete their own cart items" on public.cart_items for delete using (
  (auth.uid() = user_id) or (session_id = current_setting('request.headers', true)::json->>'x-session-id')
);

drop policy if exists "Admins can view all cart items" on public.cart_items;
create policy "Admins can view all cart items" on public.cart_items for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Update Order Items to include subscription info
alter table public.order_items add column if not exists subscription boolean default false;
alter table public.order_items add column if not exists image text;

-- Fix Foreign Key for Orders to allow joining with Profiles
-- This is required for PostgREST to detect the relationship
do $$
begin
  if exists (select 1 from information_schema.table_constraints where constraint_name = 'orders_user_id_fkey') then
    alter table public.orders drop constraint orders_user_id_fkey;
  end if;
end $$;

alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id)
  references public.profiles(id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name;
  return new;
exception
  when others then
    raise warning 'Error in handle_new_user: %', SQLERRM;
    return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill profiles for existing users (Run this once to fix missing profiles)
insert into public.profiles (id, email, full_name)
select id, email, coalesce(raw_user_meta_data->>'full_name', '')
from auth.users
where id not in (select id from public.profiles)
on conflict do nothing;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
