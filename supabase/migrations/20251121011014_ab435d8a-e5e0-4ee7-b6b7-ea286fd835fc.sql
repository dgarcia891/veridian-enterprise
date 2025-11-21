-- First, let's see what policies exist (if any)
-- Then create the correct INSERT policy for public access

-- Drop any existing policies on ai_audit_submissions
DROP POLICY IF EXISTS "Anyone can submit AI audits" ON public.ai_audit_submissions;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.ai_audit_submissions;
DROP POLICY IF EXISTS "Allow public inserts" ON public.ai_audit_submissions;

-- Create a permissive INSERT policy that allows all inserts
CREATE POLICY "Enable insert for all users"
ON public.ai_audit_submissions
FOR INSERT
WITH CHECK (true);