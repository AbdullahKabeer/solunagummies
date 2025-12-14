-- Fix KPI Funnel View to be more permissive with dates
-- Run this in the Supabase SQL Editor to update the view.

-- Drop the view first to allow changing column types
DROP VIEW IF EXISTS public.kpi_funnel_daily;

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
LEFT JOIN public.product_views pv ON s.id = pv.session_id 
LEFT JOIN public.cart_events ce_add ON s.id = ce_add.session_id AND ce_add.event_type = 'add'
LEFT JOIN public.checkout_events co ON s.id = co.session_id 
LEFT JOIN public.orders o ON s.id = o.session_id 
GROUP BY 1
ORDER BY 1 DESC;
