-- Seed Data for Soluna
-- Run this in the Supabase SQL Editor to populate your database with sample data.

-- 1. Products
INSERT INTO public.products (id, title, description, slug, sku, price, cost_per_item, status, track_quantity, quantity_available)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Soluna Focus Protocol (1 Month)', 'Daily brain fuel for sustained focus.', 'soluna-focus-protocol-1', 'FG1O', 74.95, 15.00, 'active', true, 1000),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Soluna Focus Protocol (Subscription)', 'Monthly supply of Soluna.', 'soluna-focus-protocol-sub', 'FG1S', 59.96, 15.00, 'active', true, 5000);

-- 2. Customers
INSERT INTO public.customers (id, email, first_name, last_name, orders_count, total_spent, created_at, customer_segment)
VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'alice@example.com', 'Alice', 'Smith', 1, 74.95, now() - interval '5 days', 'new'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'bob@example.com', 'Bob', 'Jones', 3, 179.88, now() - interval '30 days', 'loyal'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'charlie@example.com', 'Charlie', 'Brown', 0, 0, now() - interval '1 day', 'prospect');

-- 3. Sessions
INSERT INTO public.sessions (id, visitor_id, user_agent, path, ip_address, country, city, device_type, utm_source, utm_medium, created_at)
VALUES
  ('sess_001', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '/', '192.168.1.1', 'US', 'New York', 'Desktop', 'google', 'cpc', now() - interval '5 days'),
  ('sess_002', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', '/product', '192.168.1.2', 'US', 'Los Angeles', 'Mobile', 'instagram', 'social', now() - interval '2 days'),
  ('sess_003', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a53', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '/', '192.168.1.3', 'UK', 'London', 'Desktop', NULL, NULL, now() - interval '1 hour');

-- 4. Orders
INSERT INTO public.orders (id, customer_id, session_id, visitor_id, amount, subtotal_price, total_tax, total_shipping, status, financial_status, fulfillment_status, created_at, order_number)
VALUES
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'sess_001', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 74.95, 74.95, 0, 0, 'paid', 'paid', 'fulfilled', now() - interval '5 days', 1001),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'sess_002', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 59.96, 59.96, 0, 0, 'paid', 'paid', 'unfulfilled', now() - interval '2 days', 1002);

-- 5. Order Items
INSERT INTO public.order_items (id, order_id, product_id, product_uuid, name, quantity, price, sku, cost_per_item)
VALUES
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'soluna-focus-protocol', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Soluna Focus Protocol (1 Month)', 1, 74.95, 'FG1O', 15.00),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'soluna-focus-protocol', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Soluna Focus Protocol (Subscription)', 1, 59.96, 'FG1S', 15.00);

-- 6. Page Views
INSERT INTO public.page_views (session_id, url, path, title, time_on_page, created_at)
VALUES
  ('sess_001', 'https://soluna.com/', '/', 'Home', 45, now() - interval '5 days'),
  ('sess_001', 'https://soluna.com/product', '/product', 'Product', 120, now() - interval '5 days' + interval '45 seconds'),
  ('sess_002', 'https://soluna.com/', '/', 'Home', 30, now() - interval '2 days'),
  ('sess_003', 'https://soluna.com/', '/', 'Home', 10, now() - interval '1 hour');

-- 7. Cart Events
INSERT INTO public.cart_events (session_id, event_type, product_id, sku, quantity, unit_price, total_value, created_at)
VALUES
  ('sess_001', 'add', 'soluna-focus-protocol', 'FG1O', 1, 74.95, 74.95, now() - interval '5 days' + interval '2 minutes'),
  ('sess_002', 'add', 'soluna-focus-protocol', 'FG1S', 1, 59.96, 59.96, now() - interval '2 days' + interval '1 minute');

-- 8. Checkout Events
INSERT INTO public.checkout_events (session_id, step, step_number, cart_value, created_at)
VALUES
  ('sess_001', 'initiated', 1, 74.95, now() - interval '5 days' + interval '3 minutes'),
  ('sess_001', 'completed', 4, 74.95, now() - interval '5 days' + interval '5 minutes'),
  ('sess_002', 'initiated', 1, 59.96, now() - interval '2 days' + interval '2 minutes'),
  ('sess_002', 'completed', 4, 59.96, now() - interval '2 days' + interval '4 minutes');

-- 9. Subscription Events
INSERT INTO public.subscription_events (customer_id, order_id, event_type, product_sku, interval_type, mrr_change, created_at)
VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'created', 'FG1S', 'monthly', 59.96, now() - interval '2 days');

-- 10. Inventory Movements
INSERT INTO public.inventory_movements (product_id, sku, movement_type, quantity_change, quantity_before, quantity_after, created_at)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FG1O', 'sale', -1, 1001, 1000, now() - interval '5 days'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'FG1S', 'sale', -1, 5001, 5000, now() - interval '2 days');
