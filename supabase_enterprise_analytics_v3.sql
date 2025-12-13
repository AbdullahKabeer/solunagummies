-- ⚠️ ENTERPRISE E-COMMERCE ANALYTICS SCHEMA V3
-- This schema implements deep data collection to rival Shopify+ and leading DTC brands.
-- Run this in your Supabase SQL Editor.

-- ==============================================================================
-- PART 1: ENHANCED TRACKING TABLES
-- ==============================================================================

-- 1.1 PAGE VIEWS (Granular page-level analytics, separate from events)
CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text REFERENCES public.sessions(id),
  visitor_id uuid,
  url text NOT NULL,
  path text,
  title text,
  referrer text,
  referrer_host text,
  time_on_page integer, -- seconds, updated on next page view or session end
  scroll_depth integer, -- percentage 0-100
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT page_views_pkey PRIMARY KEY (id)
);

-- 1.2 CLICK TRACKING (Heatmap-style click data)
CREATE TABLE IF NOT EXISTS public.click_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text REFERENCES public.sessions(id),
  visitor_id uuid,
  page_url text,
  element_id text,
  element_class text,
  element_tag text,
  element_text text, -- First 100 chars of inner text
  x_position integer,
  y_position integer,
  viewport_width integer,
  viewport_height integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT click_events_pkey PRIMARY KEY (id)
);

-- 1.3 FORM INTERACTIONS (Track form field engagement)
CREATE TABLE IF NOT EXISTS public.form_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text REFERENCES public.sessions(id),
  visitor_id uuid,
  form_id text,
  form_name text,
  field_name text,
  event_type text, -- 'focus', 'blur', 'change', 'submit', 'abandon'
  field_value_length integer, -- Don't store actual values for privacy
  time_spent_ms integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT form_events_pkey PRIMARY KEY (id)
);

-- 1.4 CART EVENTS (Full funnel tracking for cart actions)
CREATE TABLE IF NOT EXISTS public.cart_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text REFERENCES public.sessions(id),
  visitor_id uuid,
  event_type text NOT NULL, -- 'add', 'remove', 'update_qty', 'view', 'abandon'
  product_id text,
  sku text,
  product_name text,
  quantity integer,
  unit_price numeric,
  total_value numeric,
  cart_total numeric, -- Total cart value at time of event
  cart_item_count integer,
  source_page text, -- Where the action originated
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cart_events_pkey PRIMARY KEY (id)
);

-- 1.5 CHECKOUT EVENTS (Step-by-step checkout funnel)
CREATE TABLE IF NOT EXISTS public.checkout_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text REFERENCES public.sessions(id),
  visitor_id uuid,
  checkout_token text, -- Unique per checkout attempt
  step text NOT NULL, -- 'initiated', 'contact_info', 'shipping', 'payment', 'completed', 'abandoned'
  step_number integer,
  cart_value numeric,
  item_count integer,
  shipping_method text,
  payment_method text,
  discount_code text,
  error_message text, -- If step failed
  time_on_step_ms integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT checkout_events_pkey PRIMARY KEY (id)
);

-- 1.6 SEARCH QUERIES (Site search analytics)
CREATE TABLE IF NOT EXISTS public.search_queries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text REFERENCES public.sessions(id),
  visitor_id uuid,
  query text NOT NULL,
  results_count integer,
  clicked_result_position integer, -- Which result they clicked (null if none)
  clicked_product_id text,
  filters_applied jsonb, -- e.g. {"category": "gummies", "price_range": "50-100"}
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT search_queries_pkey PRIMARY KEY (id)
);

-- 1.7 PRODUCT VIEWS (Detailed product page analytics)
CREATE TABLE IF NOT EXISTS public.product_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  session_id text REFERENCES public.sessions(id),
  visitor_id uuid,
  product_id text,
  sku text,
  product_name text,
  variant_viewed text,
  price_shown numeric,
  source_page text, -- How they got here (collection, search, direct, ad)
  time_on_page integer,
  added_to_cart boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_views_pkey PRIMARY KEY (id)
);

-- 1.8 MARKETING ATTRIBUTION (Multi-touch attribution)
CREATE TABLE IF NOT EXISTS public.attribution_touchpoints (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL,
  session_id text REFERENCES public.sessions(id),
  touchpoint_number integer, -- 1st touch, 2nd touch, etc.
  channel text, -- 'organic', 'paid_search', 'paid_social', 'email', 'direct', 'referral'
  source text, -- 'google', 'facebook', 'instagram', 'tiktok', etc.
  medium text,
  campaign text,
  content text,
  term text,
  landing_page text,
  referrer text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT attribution_touchpoints_pkey PRIMARY KEY (id)
);

-- 1.9 CUSTOMER FEEDBACK / NPS
CREATE TABLE IF NOT EXISTS public.customer_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id),
  order_id uuid REFERENCES public.orders(id),
  feedback_type text, -- 'nps', 'csat', 'review', 'support_rating'
  score integer, -- 1-10 for NPS, 1-5 for others
  comment text,
  tags text[],
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customer_feedback_pkey PRIMARY KEY (id)
);

-- 1.10 INVENTORY MOVEMENTS (Stock history)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id),
  sku text,
  movement_type text, -- 'sale', 'restock', 'return', 'adjustment', 'damaged'
  quantity_change integer, -- Positive or negative
  quantity_before integer,
  quantity_after integer,
  reference_id uuid, -- Order ID, Return ID, etc.
  reference_type text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_movements_pkey PRIMARY KEY (id)
);

-- 1.11 REFUNDS TABLE
CREATE TABLE IF NOT EXISTS public.refunds (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id),
  customer_id uuid REFERENCES public.customers(id),
  amount numeric NOT NULL,
  reason text,
  reason_category text, -- 'defective', 'wrong_item', 'changed_mind', 'not_as_described'
  status text DEFAULT 'pending', -- 'pending', 'approved', 'processed', 'rejected'
  refund_method text, -- 'original_payment', 'store_credit'
  processed_at timestamp with time zone,
  processed_by uuid,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT refunds_pkey PRIMARY KEY (id)
);

-- 1.12 SUBSCRIPTION EVENTS (For recurring revenue tracking)
CREATE TABLE IF NOT EXISTS public.subscription_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id),
  order_id uuid REFERENCES public.orders(id),
  event_type text NOT NULL, -- 'created', 'renewed', 'cancelled', 'paused', 'resumed', 'upgraded', 'downgraded'
  subscription_id text,
  product_sku text,
  interval_type text, -- 'monthly', 'quarterly', 'annual'
  mrr_change numeric, -- Monthly Recurring Revenue impact
  cancel_reason text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subscription_events_pkey PRIMARY KEY (id)
);

-- ==============================================================================
-- PART 2: ENHANCE EXISTING TABLES
-- ==============================================================================

-- 2.1 Add columns to SESSIONS
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS exit_page text,
  ADD COLUMN IF NOT EXISTS pages_viewed integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS session_duration integer, -- seconds
  ADD COLUMN IF NOT EXISTS bounce boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_new_visitor boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS referrer_host text,
  ADD COLUMN IF NOT EXISTS screen_width integer,
  ADD COLUMN IF NOT EXISTS screen_height integer,
  ADD COLUMN IF NOT EXISTS timezone text,
  ADD COLUMN IF NOT EXISTS language text;

-- 2.2 Add columns to CUSTOMERS
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS first_order_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS last_order_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS average_order_value numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS acquisition_source text,
  ADD COLUMN IF NOT EXISTS acquisition_campaign text,
  ADD COLUMN IF NOT EXISTS lifetime_discount_used numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lifetime_refunds numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS subscription_status text, -- 'active', 'cancelled', 'never'
  ADD COLUMN IF NOT EXISTS predicted_ltv numeric, -- ML-ready field
  ADD COLUMN IF NOT EXISTS churn_risk_score numeric, -- ML-ready field
  ADD COLUMN IF NOT EXISTS customer_segment text; -- 'vip', 'at_risk', 'new', 'loyal', 'churned'

-- 2.3 Add columns to ORDERS
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS browser text,
  ADD COLUMN IF NOT EXISTS os text,
  ADD COLUMN IF NOT EXISTS ip_address text,
  ADD COLUMN IF NOT EXISTS checkout_duration_seconds integer,
  ADD COLUMN IF NOT EXISTS is_first_order boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS referrer text;

-- ==============================================================================
-- PART 3: INDEXES FOR QUERY PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_page_views_session ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON public.page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views(created_at);

CREATE INDEX IF NOT EXISTS idx_click_events_session ON public.click_events(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_events_visitor ON public.cart_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_cart_events_type ON public.cart_events(event_type);

CREATE INDEX IF NOT EXISTS idx_checkout_events_session ON public.checkout_events(session_id);
CREATE INDEX IF NOT EXISTS idx_checkout_events_step ON public.checkout_events(step);

CREATE INDEX IF NOT EXISTS idx_product_views_product ON public.product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_visitor ON public.product_views(visitor_id);

CREATE INDEX IF NOT EXISTS idx_attribution_visitor ON public.attribution_touchpoints(visitor_id);
CREATE INDEX IF NOT EXISTS idx_subscription_customer ON public.subscription_events(customer_id);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_utm ON public.orders(utm_source, utm_medium, utm_campaign);

-- ==============================================================================
-- PART 4: KPI VIEWS (Pre-computed Analytics)
-- ==============================================================================

-- Drop existing views to allow type changes
DROP VIEW IF EXISTS public.kpi_daily_sales CASCADE;
DROP VIEW IF EXISTS public.kpi_product_performance CASCADE;
DROP VIEW IF EXISTS public.kpi_customer_ltv CASCADE;
DROP VIEW IF EXISTS public.kpi_funnel_daily CASCADE;
DROP VIEW IF EXISTS public.kpi_traffic_sources CASCADE;
DROP VIEW IF EXISTS public.kpi_cart_abandonment CASCADE;
DROP VIEW IF EXISTS public.kpi_subscription_mrr CASCADE;

-- 4.1 Daily Sales Performance
CREATE OR REPLACE VIEW public.kpi_daily_sales AS
SELECT 
  date_trunc('day', created_at)::date as day,
  count(*) as total_orders,
  count(DISTINCT customer_id) as unique_customers,
  sum(subtotal_price) as gross_revenue,
  sum(total_discounts) as total_discounts,
  sum(total_shipping) as shipping_revenue,
  sum(total_tax) as tax_collected,
  sum(net_sales) as net_revenue,
  avg(net_sales) as aov,
  count(*) FILTER (WHERE is_first_order = true) as new_customer_orders,
  count(*) FILTER (WHERE is_first_order = false) as returning_customer_orders
FROM public.orders
WHERE status NOT IN ('cancelled', 'refunded')
GROUP BY 1
ORDER BY 1 DESC;

-- 4.2 Product Performance
CREATE OR REPLACE VIEW public.kpi_product_performance AS
SELECT 
  oi.sku,
  oi.name,
  count(DISTINCT oi.order_id) as orders,
  sum(oi.quantity) as units_sold,
  sum(oi.price * oi.quantity) as gross_sales,
  sum(oi.cost_per_item * oi.quantity) as total_cost,
  sum((oi.price - oi.cost_per_item) * oi.quantity) as gross_profit,
  CASE WHEN sum(oi.price * oi.quantity) > 0 
    THEN (sum((oi.price - oi.cost_per_item) * oi.quantity) / sum(oi.price * oi.quantity)) * 100 
    ELSE 0 
  END as profit_margin_pct
FROM public.order_items oi
JOIN public.orders o ON oi.order_id = o.id
WHERE o.status NOT IN ('cancelled', 'refunded')
GROUP BY oi.sku, oi.name
ORDER BY gross_sales DESC;

-- 4.3 Customer LTV Analysis
CREATE OR REPLACE VIEW public.kpi_customer_ltv AS
SELECT 
  c.id,
  c.email,
  c.first_name,
  c.last_name,
  c.orders_count,
  c.total_spent,
  c.average_order_value as aov,
  c.first_order_date,
  c.last_order_date,
  c.acquisition_source,
  c.customer_segment,
  EXTRACT(DAY FROM now() - c.last_order_date) as days_since_last_order,
  EXTRACT(DAY FROM c.last_order_date - c.first_order_date) as customer_lifetime_days
FROM public.customers c
WHERE c.orders_count > 0
ORDER BY c.total_spent DESC;

-- 4.4 Funnel Analysis (Session → Product View → Cart → Checkout → Order)
CREATE OR REPLACE VIEW public.kpi_funnel_daily AS
SELECT 
  date_trunc('day', s.created_at)::date as day,
  count(DISTINCT s.id) as sessions,
  count(DISTINCT pv.session_id) as sessions_with_product_view,
  count(DISTINCT ce_add.session_id) as sessions_with_add_to_cart,
  count(DISTINCT co.session_id) FILTER (WHERE co.step = 'initiated') as checkouts_initiated,
  count(DISTINCT co.session_id) FILTER (WHERE co.step = 'completed') as checkouts_completed,
  count(DISTINCT o.session_id) as orders,
  -- Conversion Rates
  ROUND(count(DISTINCT pv.session_id)::numeric / NULLIF(count(DISTINCT s.id), 0) * 100, 2) as product_view_rate,
  ROUND(count(DISTINCT ce_add.session_id)::numeric / NULLIF(count(DISTINCT pv.session_id), 0) * 100, 2) as add_to_cart_rate,
  ROUND(count(DISTINCT o.session_id)::numeric / NULLIF(count(DISTINCT s.id), 0) * 100, 2) as conversion_rate
FROM public.sessions s
LEFT JOIN public.product_views pv ON s.id = pv.session_id AND date_trunc('day', pv.created_at) = date_trunc('day', s.created_at)
LEFT JOIN public.cart_events ce_add ON s.id = ce_add.session_id AND ce_add.event_type = 'add' AND date_trunc('day', ce_add.created_at) = date_trunc('day', s.created_at)
LEFT JOIN public.checkout_events co ON s.id = co.session_id AND date_trunc('day', co.created_at) = date_trunc('day', s.created_at)
LEFT JOIN public.orders o ON s.id = o.session_id AND date_trunc('day', o.created_at) = date_trunc('day', s.created_at)
GROUP BY 1
ORDER BY 1 DESC;

-- 4.5 Traffic Source Attribution
CREATE OR REPLACE VIEW public.kpi_traffic_sources AS
SELECT 
  COALESCE(utm_source, 'direct') as source,
  COALESCE(utm_medium, 'none') as medium,
  utm_campaign as campaign,
  count(*) as sessions,
  count(*) FILTER (WHERE converted_at IS NOT NULL) as conversions,
  ROUND(count(*) FILTER (WHERE converted_at IS NOT NULL)::numeric / NULLIF(count(*), 0) * 100, 2) as conversion_rate,
  count(*) FILTER (WHERE bounce = true) as bounces,
  ROUND(count(*) FILTER (WHERE bounce = true)::numeric / NULLIF(count(*), 0) * 100, 2) as bounce_rate,
  avg(session_duration) as avg_session_duration,
  avg(pages_viewed) as avg_pages_viewed
FROM public.sessions
WHERE created_at >= now() - interval '30 days'
GROUP BY 1, 2, 3
ORDER BY sessions DESC;

-- 4.6 Cart Abandonment Analysis
CREATE OR REPLACE VIEW public.kpi_cart_abandonment AS
SELECT 
  date_trunc('day', created_at)::date as day,
  count(*) FILTER (WHERE event_type = 'add') as carts_created,
  count(*) FILTER (WHERE event_type = 'abandon') as carts_abandoned,
  sum(cart_total) FILTER (WHERE event_type = 'abandon') as abandoned_value,
  ROUND(count(*) FILTER (WHERE event_type = 'abandon')::numeric / NULLIF(count(*) FILTER (WHERE event_type = 'add'), 0) * 100, 2) as abandonment_rate
FROM public.cart_events
GROUP BY 1
ORDER BY 1 DESC;

-- 4.7 Subscription Metrics (MRR)
CREATE OR REPLACE VIEW public.kpi_subscription_mrr AS
SELECT 
  date_trunc('month', created_at)::date as month,
  sum(mrr_change) FILTER (WHERE event_type = 'created') as new_mrr,
  sum(mrr_change) FILTER (WHERE event_type IN ('upgraded', 'renewed')) as expansion_mrr,
  abs(sum(mrr_change) FILTER (WHERE event_type IN ('cancelled', 'downgraded'))) as churned_mrr,
  sum(mrr_change) as net_mrr_change,
  count(*) FILTER (WHERE event_type = 'created') as new_subscriptions,
  count(*) FILTER (WHERE event_type = 'cancelled') as cancellations
FROM public.subscription_events
GROUP BY 1
ORDER BY 1 DESC;

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
