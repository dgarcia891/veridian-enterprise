-- Fix: Allow both anon AND authenticated users to insert audit submissions
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.ai_audit_submissions;

CREATE POLICY "Allow inserts"
  ON public.ai_audit_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Also allow admin SELECT for dashboard viewing
CREATE POLICY "Admins can view audits"
  ON public.ai_audit_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));