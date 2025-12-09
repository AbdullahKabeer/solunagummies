-- Add conversion tracking to sessions
alter table public.sessions add column if not exists converted_at timestamp with time zone;
alter table public.sessions add column if not exists last_order_id uuid references public.orders(id);
