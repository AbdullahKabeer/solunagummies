-- ⚠️ WARNING: This will delete ALL data from your application tables.
-- Run this in the Supabase SQL Editor to reset your database.

TRUNCATE TABLE 
  public.order_items,
  public.orders,
  public.cart_items,
  public.analytics_events,
  public.sessions
  RESTART IDENTITY CASCADE;

-- Optional: Clear profiles if you want to remove customer data (linked to auth.users)
-- TRUNCATE TABLE public.profiles CASCADE;
