
-- Drop remaining policies 
DROP POLICY IF EXISTS "Users can view own signup" ON public.customer_signups;
DROP POLICY IF EXISTS "Users can update own signup" ON public.customer_signups;
DROP POLICY IF EXISTS "Admins can view signups" ON public.customer_signups;
DROP POLICY IF EXISTS "Anyone can insert signups" ON public.customer_signups;
DROP POLICY IF EXISTS "No deletes" ON public.customer_signups;

-- Recreate all as PERMISSIVE policies
CREATE POLICY "Anyone can insert signups"
  ON public.customer_signups FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own signup"
  ON public.customer_signups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own signup"
  ON public.customer_signups FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all signups"
  ON public.customer_signups FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all signups"
  ON public.customer_signups FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "No deletes on signups"
  ON public.customer_signups FOR DELETE
  USING (false);
