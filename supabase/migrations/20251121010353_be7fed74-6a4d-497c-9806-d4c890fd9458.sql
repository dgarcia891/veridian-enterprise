-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can submit AI audits" ON ai_audit_submissions;

-- Create a new PERMISSIVE policy (default behavior)
CREATE POLICY "Anyone can submit AI audits"
ON ai_audit_submissions
FOR INSERT
TO public
WITH CHECK (true);