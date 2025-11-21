
-- Add SELECT policy for anon role to allow reading after insert
CREATE POLICY "Allow anonymous reads after insert"
ON public.ai_audit_submissions
FOR SELECT
TO anon
USING (true);
