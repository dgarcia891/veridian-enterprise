-- Fix RLS policy for customer_signups to allow insertions
-- The issue is that the INSERT policy is RESTRICTIVE instead of PERMISSIVE

-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert signups" ON public.customer_signups;

-- Create a PERMISSIVE INSERT policy that allows anonymous and authenticated users to insert
CREATE POLICY "Anyone can insert signups"
ON public.customer_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (true);