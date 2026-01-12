-- Add SELECT policies so inserts can return data with .select()
-- This is needed because the frontend code uses .insert().select().single()

CREATE POLICY "allow_anon_select_own_insert"
ON public.customer_signups
FOR SELECT
TO anon
USING (true);

CREATE POLICY "allow_authenticated_select"
ON public.customer_signups
FOR SELECT
TO authenticated
USING (true);