-- 1. Create Customers from existing Orders (if they don't exist)
INSERT INTO public.customers (email, first_name, last_name, created_at, updated_at)
SELECT DISTINCT 
  (shipping_details->>'email')::text as email,
  split_part((shipping_details->>'name')::text, ' ', 1) as first_name,
  substring((shipping_details->>'name')::text from position(' ' in (shipping_details->>'name')::text) + 1) as last_name,
  min(created_at) as created_at,
  now() as updated_at
FROM public.orders
WHERE shipping_details->>'email' IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM public.customers c WHERE c.email = (orders.shipping_details->>'email')::text
)
GROUP BY 1, 2, 3;

-- 2. Link Orders to Customers
UPDATE public.orders o
SET customer_id = c.id
FROM public.customers c
WHERE (o.shipping_details->>'email')::text = c.email
AND o.customer_id IS NULL;

-- 3. Recalculate Customer Stats
UPDATE public.customers c
SET 
  orders_count = (SELECT count(*) FROM public.orders o WHERE o.customer_id = c.id),
  total_spent = (SELECT coalesce(sum(net_sales), 0) FROM public.orders o WHERE o.customer_id = c.id),
  last_order_id = (SELECT id FROM public.orders o WHERE o.customer_id = c.id ORDER BY created_at DESC LIMIT 1);
