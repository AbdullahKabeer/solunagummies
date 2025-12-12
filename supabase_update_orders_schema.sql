-- Add missing columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS visitor_id UUID;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal_price NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_tax NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_shipping NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_discounts NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS net_sales NUMERIC DEFAULT 0;

-- Add missing columns to order_items table
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS cost_per_item NUMERIC DEFAULT 0;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS sku TEXT;

-- Force schema cache reload
NOTIFY pgrst, 'reload config';
