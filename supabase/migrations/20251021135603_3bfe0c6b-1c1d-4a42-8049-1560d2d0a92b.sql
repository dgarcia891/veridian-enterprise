-- Fix security issues in customer_signups table

-- Drop the problematic SELECT policy that allows public access to all records
DROP POLICY IF EXISTS "Users can view their own signups" ON public.customer_signups;

-- Add explicit DENY policies for UPDATE operations (records should be immutable)
CREATE POLICY "Deny all updates"
ON public.customer_signups
FOR UPDATE
TO authenticated, anon
USING (false);

-- Add explicit DENY policies for DELETE operations (records should be retained)
CREATE POLICY "Deny all deletes"
ON public.customer_signups
FOR DELETE
TO authenticated, anon
USING (false);