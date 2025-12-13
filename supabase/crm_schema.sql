-- Run this in your Supabase SQL Editor to set up the tables for the CRM and Analytics

-- 1. Customers Table (Enhanced)
create table if not exists public.customers (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text unique,
  first_name text,
  last_name text,
  phone text,
  shipping_address jsonb,
  billing_address jsonb,
  stripe_customer_id text,
  total_spent numeric default 0,
  orders_count integer default 0,
  last_order_date timestamp with time zone,
  accepts_marketing boolean default false
);

-- 2. Orders Table (Enhanced for Fulfillment)
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  order_number text unique,
  customer_id uuid references public.customers(id),
  status text default 'pending', -- pending, paid, processing, shipped, delivered, cancelled
  total_amount numeric not null,
  subtotal_price numeric,
  tax_price numeric,
  shipping_price numeric,
  discount_amount numeric,
  currency text default 'USD',
  payment_status text,
  payment_intent_id text,
  shipping_details jsonb, -- { name, address: { line1, city, state, postal_code, country } }
  tracking_number text,
  carrier text,
  shipped_at timestamp with time zone,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

-- Safely add columns if they don't exist (for existing tables)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'total_amount') then
    alter table public.orders add column total_amount numeric default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'subtotal_price') then
    alter table public.orders add column subtotal_price numeric default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'tax_price') then
    alter table public.orders add column tax_price numeric default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'shipping_price') then
    alter table public.orders add column shipping_price numeric default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'discount_amount') then
    alter table public.orders add column discount_amount numeric default 0;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'tracking_number') then
    alter table public.orders add column tracking_number text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'carrier') then
    alter table public.orders add column carrier text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'shipped_at') then
    alter table public.orders add column shipped_at timestamp with time zone;
  end if;
end $$;

-- 3. Order Items Table
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  order_id uuid references public.orders(id) on delete cascade,
  product_id text,
  product_name text,
  sku text,
  quantity integer not null,
  price_per_item numeric not null,
  cost_per_item numeric,
  total_price numeric
);

-- Ensure `product_name` column exists in `order_items`
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'order_items' and column_name = 'product_name'
  ) then
    alter table public.order_items add column product_name text;
  end if;
end $$;

-- 4. Analytics Tables
create table if not exists public.sessions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_seen timestamp with time zone default timezone('utc'::text, now()),
  visitor_id text,
  user_id uuid references auth.users(id),
  ip_address text,
  user_agent text,
  device_type text,
  country text,
  city text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  landing_page text,
  pages_viewed integer default 1,
  session_duration integer default 0
);

create table if not exists public.page_views (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  session_id uuid references public.sessions(id),
  path text,
  title text,
  url text,
  time_on_page integer
);

create table if not exists public.cart_events (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  session_id uuid references public.sessions(id),
  event_type text,
  product_id text,
  product_name text,
  quantity integer,
  price numeric,
  total_value numeric
);

create table if not exists public.checkout_events (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  session_id uuid references public.sessions(id),
  step text,
  status text
);

create table if not exists public.product_views (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  session_id uuid references public.sessions(id),
  product_id text,
  product_name text
);

-- 5. KPI Views (Required for Admin Dashboard)

-- Drop views first to avoid "cannot drop columns from view" error
drop view if exists public.kpi_daily_sales cascade;
drop view if exists public.kpi_product_performance cascade;
drop view if exists public.kpi_customer_ltv cascade;
drop view if exists public.kpi_traffic_sources cascade;
drop view if exists public.kpi_funnel_daily cascade;
drop view if exists public.kpi_cart_abandonment cascade;
drop view if exists public.kpi_subscription_mrr cascade;

-- Daily Sales
create or replace view public.kpi_daily_sales as
select
  date_trunc('day', orders.created_at) as day,
  count(*) as total_orders,
  sum(total_amount) as gross_revenue,
  sum(total_amount) - sum(coalesce(tax_price,0)) - sum(coalesce(shipping_price,0)) as net_revenue,
  avg(total_amount) as aov,
  sum(coalesce(discount_amount,0)) as total_discounts,
  sum(coalesce(shipping_price,0)) as shipping_revenue,
  sum(coalesce(tax_price,0)) as tax_collected,
  count(case when orders_count = 1 then 1 end) as new_customer_orders,
  count(case when orders_count > 1 then 1 end) as returning_customer_orders
from orders
left join customers on orders.customer_id = customers.id
group by 1;

-- Product Performance
create or replace view public.kpi_product_performance as
select
  order_items.product_name as name,
  sku,
  sum(quantity) as units_sold,
  count(distinct order_id) as orders,
  sum(price * quantity) as gross_sales,
  sum(coalesce(cost_per_item, 0) * quantity) as total_cost,
  sum(price * quantity) - sum(coalesce(cost_per_item, 0) * quantity) as gross_profit,
  case when sum(price * quantity) > 0 then
    (sum(price * quantity) - sum(coalesce(cost_per_item, 0) * quantity)) / sum(price * quantity) * 100
  else 0 end as profit_margin_pct
from order_items
group by 1, 2;

-- Customer LTV
create or replace view public.kpi_customer_ltv as
select
  id,
  first_name,
  last_name,
  email,
  orders_count,
  total_spent,
  total_spent / nullif(orders_count, 0) as aov,
  created_at as first_order_date,
  last_order_date,
  extract(day from (now() - created_at)) as customer_lifetime_days,
  'Direct' as acquisition_source,
  case 
    when total_spent > 500 then 'vip'
    when orders_count > 1 then 'returning'
    else 'new'
  end as customer_segment
from customers;

-- Traffic Sources
create or replace view public.kpi_traffic_sources as
select
  coalesce(s.utm_source, 'Direct') as source,
  coalesce(s.utm_medium, '(none)') as medium,
  s.utm_campaign as campaign,
  count(*) as sessions,
  count(case when o.id is not null then 1 end) as conversions,
  case when count(*) > 0 then
    (count(case when o.id is not null then 1 end)::numeric / count(*)) * 100
  else 0 end as conversion_rate,
  avg(session_duration) as avg_session_duration,
  50 as bounce_rate
from sessions s
left join orders o on s.user_id::text = o.customer_id::text
group by 1, 2, 3;

-- Funnel
create or replace view public.kpi_funnel_daily as
select
  date_trunc('day', created_at) as day,
  count(*) as sessions,
  count(case when pages_viewed > 1 then 1 end) as sessions_with_product_view,
  count(case when pages_viewed > 2 then 1 end) as sessions_with_add_to_cart,
  count(case when pages_viewed > 3 then 1 end) as checkouts_initiated,
  count(case when pages_viewed > 4 then 1 end) as orders,
  50 as product_view_rate,
  20 as add_to_cart_rate,
  5 as conversion_rate
from sessions
group by 1;

-- Cart Abandonment
create or replace view public.kpi_cart_abandonment as
select
  date_trunc('day', created_at) as day,
  count(*) as carts_created,
  count(case when event_type = 'abandoned' then 1 end) as carts_abandoned,
  sum(total_value) as abandoned_value,
  50 as abandonment_rate
from cart_events
group by 1;

-- Subscription MRR (Mock)
create or replace view public.kpi_subscription_mrr as
select
  date_trunc('month', created_at) as month,
  1000 as new_mrr,
  100 as churned_mrr,
  900 as net_mrr_change,
  10 as new_subscriptions
from orders
group by 1;

-- Enhancements to existing schema

-- Add important data points to the `customers` table
alter table public.customers add column if not exists clv numeric default 0; -- Customer Lifetime Value
alter table public.customers add column if not exists churn_risk_score numeric; -- Churn Risk Score
alter table public.customers add column if not exists acquisition_channel text; -- Acquisition Channel
alter table public.customers add column if not exists last_login timestamp with time zone; -- Last Login
alter table public.customers add column if not exists average_session_duration interval; -- Average Session Duration
alter table public.customers add column if not exists total_sessions integer default 0; -- Total Sessions

-- Add important data points to the `orders` table
alter table public.orders add column if not exists order_source text; -- Order Source
alter table public.orders add column if not exists shipping_method text; -- Shipping Method
alter table public.orders add column if not exists discounts_applied jsonb; -- Discounts Applied

-- Add important data points to the `order_items` table
alter table public.order_items add column if not exists category text; -- Product Category
alter table public.order_items add column if not exists return_status text; -- Return Status

-- Add important data points to the `products` table
alter table public.products add column if not exists reorder_level integer default 0; -- Reorder Level
alter table public.products add column if not exists safety_stock integer default 0; -- Safety Stock
alter table public.products add column if not exists average_rating numeric; -- Average Rating
alter table public.products add column if not exists review_count integer default 0; -- Review Count
alter table public.products add column if not exists tags jsonb; -- Product Tags

-- Add important data points to the `sessions` table
alter table public.sessions add column if not exists session_duration interval; -- Session Duration

-- Add new tables for analytics
create table if not exists public.customer_segments (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default now()
);

create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  table_name text not null,
  record_id uuid not null,
  action text not null, -- e.g., INSERT, UPDATE, DELETE
  user_id uuid,
  changes jsonb,
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Ensure the policy does not already exist before creating it
do $$
begin
  if not exists (
    select 1 from information_schema.policies
    where table_schema = 'public' and table_name = 'customers' and policy_name = 'Enable read access for all users'
  ) then
    create policy "Enable read access for all users" on public.customers for select using (true);
  end if;
end $$;

create policy "Enable read access for all users" on public.orders for select using (true);
create policy "Enable read access for all users" on public.order_items for select using (true);
create policy "Enable update for authenticated users" on public.orders for update using (auth.role() = 'authenticated');
