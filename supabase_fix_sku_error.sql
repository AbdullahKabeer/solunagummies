-- 1. Add SKU column to cart_items table
ALTER TABLE public.cart_items ADD COLUMN IF NOT EXISTS sku TEXT;

-- 2. Force a schema cache reload (This fixes the "schema cache" error)
NOTIFY pgrst, 'reload config';
