-- Add updated_at tracking to cart_items
-- Run this to enable "Last Active" tracking for carts

-- 1. Add updated_at column
alter table public.cart_items add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- 2. Create function to auto-update timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 3. Create trigger
drop trigger if exists on_cart_items_updated on public.cart_items;
create trigger on_cart_items_updated
  before update on public.cart_items
  for each row execute procedure public.handle_updated_at();
