-- Clear all data from tables
-- Run this in the Supabase SQL Editor to reset your database.

TRUNCATE TABLE 
  public.addresses,
  public.analytics_events,
  public.attribution_touchpoints,
  public.cart_events,
  public.cart_items,
  public.checkout_events,
  public.click_events,
  public.customer_feedback,
  public.customers,
  public.discounts,
  public.form_events,
  public.inventory_movements,
  public.order_items,
  public.orders,
  public.page_views,
  public.product_views,
  public.products,
  public.refunds,
  public.search_queries,
  public.sessions,
  public.subscription_events
CASCADE;
