-- Add SKU column to cart_items table
alter table public.cart_items add column if not exists sku text;
