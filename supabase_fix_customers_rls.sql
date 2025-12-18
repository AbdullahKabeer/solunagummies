-- Enable RLS on customers and addresses
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- CUSTOMERS POLICIES

-- Drop insecure policy if it exists
DROP POLICY IF EXISTS "Enable read access for all users" ON public.customers;

-- Allow users to view their own customer profile
CREATE POLICY "Users can view own customer profile" ON public.customers
FOR SELECT USING (
  auth.uid() = auth_user_id
);

-- Allow users to update their own customer profile
CREATE POLICY "Users can update own customer profile" ON public.customers
FOR UPDATE USING (
  auth.uid() = auth_user_id
);

-- Allow users to claim their customer profile (if email matches and no auth_user_id set)
CREATE POLICY "Users can claim their customer profile" ON public.customers
FOR UPDATE USING (
  email = (auth.jwt() ->> 'email') AND auth_user_id IS NULL
) WITH CHECK (
  auth_user_id = auth.uid()
);

-- Allow users to insert their own customer profile
CREATE POLICY "Users can insert own customer profile" ON public.customers
FOR INSERT WITH CHECK (
  auth.uid() = auth_user_id
);


-- ADDRESSES POLICIES

-- Allow users to view their own addresses
CREATE POLICY "Users can view own addresses" ON public.addresses
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = addresses.customer_id 
    AND customers.auth_user_id = auth.uid()
  )
);

-- Allow users to insert their own addresses
CREATE POLICY "Users can insert own addresses" ON public.addresses
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = addresses.customer_id 
    AND customers.auth_user_id = auth.uid()
  )
);

-- Allow users to update their own addresses
CREATE POLICY "Users can update own addresses" ON public.addresses
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = addresses.customer_id 
    AND customers.auth_user_id = auth.uid()
  )
);

-- Allow users to delete their own addresses
CREATE POLICY "Users can delete own addresses" ON public.addresses
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.customers 
    WHERE customers.id = addresses.customer_id 
    AND customers.auth_user_id = auth.uid()
  )
);
