-- 1. Add visitor_id to cart_items
ALTER TABLE public.cart_items ADD COLUMN IF NOT EXISTS visitor_id UUID;

-- 2. Update RLS Policies to allow access via x-visitor-id header
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
CREATE POLICY "Users can view their own cart items" ON public.cart_items FOR SELECT USING (
  (auth.uid() = user_id) OR 
  (session_id = current_setting('request.headers', true)::json->>'x-session-id') OR
  (visitor_id::text = current_setting('request.headers', true)::json->>'x-visitor-id')
);

DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
CREATE POLICY "Users can insert their own cart items" ON public.cart_items FOR INSERT WITH CHECK (
  (auth.uid() = user_id) OR 
  (session_id = current_setting('request.headers', true)::json->>'x-session-id') OR
  (visitor_id::text = current_setting('request.headers', true)::json->>'x-visitor-id')
);

DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
CREATE POLICY "Users can update their own cart items" ON public.cart_items FOR UPDATE USING (
  (auth.uid() = user_id) OR 
  (session_id = current_setting('request.headers', true)::json->>'x-session-id') OR
  (visitor_id::text = current_setting('request.headers', true)::json->>'x-visitor-id')
);

DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;
CREATE POLICY "Users can delete their own cart items" ON public.cart_items FOR DELETE USING (
  (auth.uid() = user_id) OR 
  (session_id = current_setting('request.headers', true)::json->>'x-session-id') OR
  (visitor_id::text = current_setting('request.headers', true)::json->>'x-visitor-id')
);

-- 3. Force cache reload
NOTIFY pgrst, 'reload config';
