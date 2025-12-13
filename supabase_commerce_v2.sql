-- ⚠️ ADVANCED COMMERCE SCHEMA V2
-- This script upgrades your Supabase schema to a "Shopify-lite" architecture.
-- It introduces Products, Customers, Discounts, and advanced KPI tracking.

-- 1. ENUMS: Standardize statuses for better logic
DO $$ BEGIN
    CREATE TYPE public.order_status_type AS ENUM ('open', 'archived', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.payment_status_type AS ENUM ('pending', 'paid', 'refunded', 'partially_refunded', 'voided', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.fulfillment_status_type AS ENUM ('unfulfilled', 'partially_fulfilled', 'fulfilled', 'restocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PRODUCTS TABLE (The Catalog)
-- Centralizes product data instead of relying on hardcoded frontend values
CREATE TABLE IF NOT EXISTS public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  slug text UNIQUE,
  sku text UNIQUE, -- Critical for inventory linking
  price numeric NOT NULL DEFAULT 0,
  compare_at_price numeric, -- For "Sale" display (e.g. $50 crossed out)
  cost_per_item numeric DEFAULT 0, -- For Profit/Margin calculations
  quantity_available integer DEFAULT 0, -- Inventory tracking
  track_quantity boolean DEFAULT true,
  status text DEFAULT 'active', -- 'active', 'draft', 'archived'
  images jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

-- 3. CUSTOMERS TABLE (The CRM)
-- Separates "Auth User" from "Commerce Customer".
-- Allows tracking guest checkouts and calculating LTV across sessions.
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id), -- Optional link to login
  email text,
  phone text,
  first_name text,
  last_name text,
  accepts_marketing boolean DEFAULT false,
  orders_count integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  last_order_id uuid,
  note text,
  tags text[], -- e.g. ['vip', 'wholesaler']
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (id),
  CONSTRAINT customers_email_unique UNIQUE (email)
);

-- 4. ADDRESSES TABLE
-- Stores multiple addresses per customer (Shipping/Billing)
CREATE TABLE IF NOT EXISTS public.addresses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  company text,
  address1 text,
  address2 text,
  city text,
  province text,
  country text,
  zip text,
  phone text,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT addresses_pkey PRIMARY KEY (id)
);

-- 5. DISCOUNTS TABLE
-- Native discount engine support
CREATE TABLE IF NOT EXISTS public.discounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type text NOT NULL, -- 'percentage', 'fixed_amount', 'shipping'
  value numeric NOT NULL,
  starts_at timestamp with time zone DEFAULT now(),
  ends_at timestamp with time zone,
  usage_limit integer,
  usage_count integer DEFAULT 0,
  min_requirement_type text, -- 'amount', 'quantity'
  min_requirement_value numeric,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT discounts_pkey PRIMARY KEY (id)
);

-- 6. ENHANCE ORDERS TABLE
-- Adds fields for robust order management and attribution
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS order_number serial, -- Friendly ID like #1001
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customers(id),
  ADD COLUMN IF NOT EXISTS financial_status public.payment_status_type DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS fulfillment_status public.fulfillment_status_type DEFAULT 'unfulfilled',
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS cancel_reason text,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS tags text[],
  ADD COLUMN IF NOT EXISTS note text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS processed_at timestamp with time zone;

-- 7. ENHANCE ORDER ITEMS
-- Links items back to the product catalog for analytics
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS product_uuid uuid REFERENCES public.products(id),
  ADD COLUMN IF NOT EXISTS variant_title text,
  ADD COLUMN IF NOT EXISTS vendor text,
  ADD COLUMN IF NOT EXISTS properties jsonb, -- Custom line item properties
  ADD COLUMN IF NOT EXISTS fulfillable_quantity integer,
  ADD COLUMN IF NOT EXISTS fulfillment_status public.fulfillment_status_type DEFAULT 'unfulfilled';

-- 8. INDEXES FOR PERFORMANCE
-- Speeds up dashboard queries
CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON public.sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_utm_source ON public.sessions(utm_source);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON public.sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- 9. KPI VIEWS (The "Shopify Dashboard" Power)

-- View: Daily Sales & Revenue
CREATE OR REPLACE VIEW public.kpi_daily_sales AS
SELECT 
  date_trunc('day', created_at) as day,
  count(*) as total_orders,
  sum(net_sales) as total_revenue,
  avg(net_sales) as aov,
  sum(total_shipping) as shipping_revenue,
  sum(total_tax) as tax_collected
FROM public.orders
WHERE status != 'cancelled'
GROUP BY 1
ORDER BY 1 DESC;

-- View: Product Performance (Best Sellers)
CREATE OR REPLACE VIEW public.kpi_product_performance AS
SELECT 
  oi.name,
  oi.sku,
  sum(oi.quantity) as units_sold,
  sum(oi.price * oi.quantity) as gross_sales,
  sum((oi.price - oi.cost_per_item) * oi.quantity) as gross_profit
FROM public.order_items oi
JOIN public.orders o ON oi.order_id = o.id
WHERE o.status != 'cancelled'
GROUP BY 1, 2
ORDER BY 3 DESC;

-- View: Customer LTV (Lifetime Value)
CREATE OR REPLACE VIEW public.kpi_customer_ltv AS
SELECT 
  c.id,
  c.email,
  c.orders_count,
  c.total_spent,
  c.created_at as first_seen,
  (c.total_spent / NULLIF(c.orders_count, 0)) as avg_order_value
FROM public.customers c
WHERE c.orders_count > 0
ORDER BY c.total_spent DESC;

-- 10. AUTOMATION TRIGGERS

-- Trigger: Auto-update Customer stats on new order
CREATE OR REPLACE FUNCTION public.update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.customers
  SET 
    orders_count = orders_count + 1,
    total_spent = total_spent + NEW.net_sales,
    last_order_id = NEW.id,
    updated_at = now()
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_customer_stats ON public.orders;
CREATE TRIGGER trigger_update_customer_stats
AFTER INSERT ON public.orders
FOR EACH ROW
WHEN (NEW.customer_id IS NOT NULL)
EXECUTE FUNCTION public.update_customer_stats();

-- Trigger: Auto-decrement inventory
CREATE OR REPLACE FUNCTION public.decrement_inventory()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET quantity_available = quantity_available - NEW.quantity
  WHERE id = NEW.product_uuid AND track_quantity = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_decrement_inventory ON public.order_items;
CREATE TRIGGER trigger_decrement_inventory
AFTER INSERT ON public.order_items
FOR EACH ROW
WHEN (NEW.product_uuid IS NOT NULL)
EXECUTE FUNCTION public.decrement_inventory();

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
