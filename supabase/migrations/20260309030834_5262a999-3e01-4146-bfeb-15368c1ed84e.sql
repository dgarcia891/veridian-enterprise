
-- 1. ai_audit_submissions: Remove overly permissive anonymous SELECT
DROP POLICY IF EXISTS "Allow anonymous reads after insert" ON public.ai_audit_submissions;

-- 2. customer_signups: Remove anonymous SELECT on unlinked signups (exposes PII)
DROP POLICY IF EXISTS "Anon can select unlinked signups" ON public.customer_signups;
-- Also remove redundant/conflicting policies
DROP POLICY IF EXISTS "prevent_all_select" ON public.customer_signups;
DROP POLICY IF EXISTS "prevent_updates" ON public.customer_signups;
DROP POLICY IF EXISTS "prevent_deletes" ON public.customer_signups;
DROP POLICY IF EXISTS "allow_anon_insert" ON public.customer_signups;
DROP POLICY IF EXISTS "allow_anon_insert_only" ON public.customer_signups;
DROP POLICY IF EXISTS "allow_authenticated_insert" ON public.customer_signups;

-- 3. qualification_submissions: Restrict read/update to admins only
DROP POLICY IF EXISTS "Anyone can view qualifications" ON public.qualification_submissions;
DROP POLICY IF EXISTS "Anyone can update qualifications" ON public.qualification_submissions;

CREATE POLICY "Admins can view qualifications"
  ON public.qualification_submissions
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update qualifications"
  ON public.qualification_submissions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. customer_onboarding: Fix service role policy targeting public
DROP POLICY IF EXISTS "Service role full access" ON public.customer_onboarding;

CREATE POLICY "Service role full access"
  ON public.customer_onboarding
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. website_scans: Fix service role policy targeting public
DROP POLICY IF EXISTS "Service role can manage website scans" ON public.website_scans;

CREATE POLICY "Service role can manage website scans"
  ON public.website_scans
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 6. edge_function_errors: Same fix
DROP POLICY IF EXISTS "Service role can manage error logs" ON public.edge_function_errors;

CREATE POLICY "Service role can manage error logs"
  ON public.edge_function_errors
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 7. payment_rate_limits: Add proper RLS (currently has RLS enabled but no policies)
CREATE POLICY "Service role can manage rate limits"
  ON public.payment_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
