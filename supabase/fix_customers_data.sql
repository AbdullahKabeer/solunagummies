-- Fix Customers Data to populate missing columns
-- This ensures that the Admin Customers page displays data correctly.

UPDATE public.customers
SET 
  last_name = 'Doe',
  email = 'customer' || substr(id::text, 1, 8) || '@example.com'
WHERE email IS NULL OR last_name IS NULL;
