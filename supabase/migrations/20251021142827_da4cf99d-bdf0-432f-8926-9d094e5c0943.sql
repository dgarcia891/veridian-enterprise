-- Complete reset of RLS policies for customer_signups
-- Drop all existing policies
DROP POLICY IF EXISTS "Anyone can insert signups" ON public.customer_signups;
DROP POLICY IF EXISTS "Deny all updates" ON public.customer_signups;
DROP POLICY IF EXISTS "Deny all deletes" ON public.customer_signups;
DROP POLICY IF EXISTS "Users can view their own signups" ON public.customer_signups;

-- Disable and re-enable RLS to force a refresh
ALTER TABLE public.customer_signups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_signups ENABLE ROW LEVEL SECURITY;

-- Create clean INSERT policy for anon users (no restrictions)
CREATE POLICY "allow_anon_insert"
ON public.customer_signups
FOR INSERT
TO anon
WITH CHECK (true);

-- Create clean INSERT policy for authenticated users
CREATE POLICY "allow_authenticated_insert"
ON public.customer_signups
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Prevent updates (records should be immutable)
CREATE POLICY "prevent_updates"
ON public.customer_signups
FOR UPDATE
TO anon, authenticated
USING (false);

-- Prevent deletes (records should be retained)
CREATE POLICY "prevent_deletes"
ON public.customer_signups
FOR DELETE
TO anon, authenticated
USING (false);