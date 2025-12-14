-- Fix KPI Daily Sales View to calculate net_revenue dynamically
-- Run this in the Supabase SQL Editor to update the view.

DROP VIEW IF EXISTS public.kpi_daily_sales;

CREATE OR REPLACE VIEW public.kpi_daily_sales AS
SELECT 
  date_trunc('day', created_at)::date as day,
  count(*) as total_orders,
  count(DISTINCT customer_id) as unique_customers,
  sum(subtotal_price) as gross_revenue,
  sum(total_discounts) as total_discounts,
  sum(total_shipping) as shipping_revenue,
  sum(total_tax) as tax_collected,
  -- Calculate net_revenue dynamically: (subtotal - discounts) + tax + shipping
  -- Or typically for e-com reporting: subtotal - discounts
  sum(COALESCE(subtotal_price, 0) - COALESCE(total_discounts, 0)) as net_revenue,
  avg(COALESCE(subtotal_price, 0) - COALESCE(total_discounts, 0)) as aov,
  count(*) FILTER (WHERE is_first_order = true) as new_customer_orders,
  count(*) FILTER (WHERE is_first_order = false) as returning_customer_orders
FROM public.orders
WHERE status NOT IN ('cancelled', 'refunded')
GROUP BY 1
ORDER BY 1 DESC;
