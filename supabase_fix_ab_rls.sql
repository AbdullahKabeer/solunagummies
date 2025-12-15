-- Allow admins to view all tests (including drafts/paused) and manage them
CREATE POLICY "Admins can manage ab_tests" ON public.ab_tests
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Allow admins to manage variants
CREATE POLICY "Admins can manage ab_variants" ON public.ab_variants
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Allow admins to view all assignments for stats
CREATE POLICY "Admins can view all assignments" ON public.ab_assignments
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
