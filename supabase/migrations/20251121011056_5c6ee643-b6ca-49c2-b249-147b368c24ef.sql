-- Drop the existing policy
DROP POLICY IF EXISTS "Enable insert for all users" ON public.ai_audit_submissions;

-- Create policy for anonymous users (the role used by unauthenticated requests)
CREATE POLICY "Allow anonymous inserts"
ON public.ai_audit_submissions
FOR INSERT
TO anon
WITH CHECK (true);