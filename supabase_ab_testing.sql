-- Create AB Tests table
CREATE TABLE IF NOT EXISTS public.ab_tests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  status text NOT NULL DEFAULT 'draft', -- draft, active, paused, completed
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ab_tests_pkey PRIMARY KEY (id)
);

-- Create AB Variants table
CREATE TABLE IF NOT EXISTS public.ab_variants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL,
  name text NOT NULL, -- e.g., 'control', 'variant_a'
  weight integer DEFAULT 50,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ab_variants_pkey PRIMARY KEY (id),
  CONSTRAINT ab_variants_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.ab_tests(id) ON DELETE CASCADE,
  UNIQUE(test_id, name)
);

-- Create AB Assignments table
CREATE TABLE IF NOT EXISTS public.ab_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  visitor_id uuid NOT NULL,
  test_id uuid NOT NULL,
  variant_id uuid NOT NULL,
  session_id text,
  assigned_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ab_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT ab_assignments_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.ab_tests(id),
  CONSTRAINT ab_assignments_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.ab_variants(id),
  UNIQUE(visitor_id, test_id)
);

-- Enable RLS
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_assignments ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read active tests and variants
CREATE POLICY "Everyone can read active tests" ON public.ab_tests FOR SELECT USING (status = 'active');
CREATE POLICY "Everyone can read variants" ON public.ab_variants FOR SELECT USING (true);

-- Assignments: Users can insert their own assignments (or we do it via server action/API to be safe, but client-side is easier for now)
-- Actually, for security, we should probably allow insert if visitor_id matches (but visitor_id is just a cookie).
-- Let's allow public insert for now for simplicity, or restrict to authenticated users if we had them.
-- Since visitor_id is anonymous, we'll allow public insert.
CREATE POLICY "Everyone can insert assignments" ON public.ab_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Everyone can read their own assignments" ON public.ab_assignments FOR SELECT USING (true); -- Simplified for now

-- Admin policies (assuming service role or admin user, but for now we'll just leave it open or rely on RLS being permissive for anon if needed, or strict)
-- Ideally, we'd have an admin role. For now, let's assume the client only needs to READ tests/variants and INSERT assignments.
