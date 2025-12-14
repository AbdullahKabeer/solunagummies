-- Drop table if exists to ensure clean schema
drop table if exists public.products cascade;

-- Create products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  sku text unique not null,
  description text,
  price decimal(10, 2) not null,
  compare_at_price decimal(10, 2),
  currency text default 'USD',
  image_url text,
  category text, -- 'subscription', 'onetime', etc.
  active boolean default true,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- Policies
create policy "Public products are viewable by everyone." on public.products
  for select using (true);

create policy "Admins can insert products." on public.products
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update products." on public.products
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete products." on public.products
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Insert initial data based on current hardcoded values
insert into public.products (name, sku, price, compare_at_price, category, description) values
('Soluna Focus Protocol (1 Bottle)', 'FG1O', 74.95, null, 'onetime', 'One-time purchase of 1 bottle.'),
('Soluna Subscription (1 Bottle / 1 Mo)', 'FG1S1', 59.96, 74.95, 'subscription', 'Subscription: 1 Bottle every 1 Month (20% OFF).'),
('Soluna Subscription (2 Bottles / 2 Mo)', 'FG2S2', 104.94, 149.90, 'subscription', 'Subscription: 2 Bottles every 2 Months (30% OFF).'),
('Soluna Subscription (3 Bottles / 3 Mo)', 'FG3S3', 146.16, 224.85, 'subscription', 'Subscription: 3 Bottles every 3 Months (35% OFF).');
