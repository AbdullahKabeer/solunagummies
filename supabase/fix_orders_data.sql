-- Fix Orders Data to populate missing columns based on total_amount
-- This ensures that the KPI views have data to work with.

UPDATE public.orders
SET 
  subtotal_price = COALESCE(total_amount, amount, 0),
  net_sales = COALESCE(total_amount, amount, 0),
  amount = COALESCE(total_amount, amount, 0),
  total_tax = 0,
  total_shipping = 0,
  total_discounts = 0
WHERE net_sales IS NULL OR net_sales = 0;
