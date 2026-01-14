-- Fix customer_signups RLS policies to prevent public data exposure
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "allow_anon_select_own_insert" ON customer_signups;
DROP POLICY IF EXISTS "allow_authenticated_select" ON customer_signups;

-- Allow anonymous users to insert their signup (for the public form)
-- but NO ONE can read the data (only backend/admin can access via service role)
CREATE POLICY "allow_anon_insert_only" ON customer_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Prevent all SELECT access via RLS
-- (Data can only be accessed via Supabase dashboard or service role functions)
CREATE POLICY "prevent_all_select" ON customer_signups
FOR SELECT
TO anon, authenticated
USING (false);