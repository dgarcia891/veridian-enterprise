
-- Allow selecting newly inserted signups that haven't been linked to a user yet
-- This is needed for the signup flow where the insert returns the ID
CREATE POLICY "Anon can select unlinked signups"
  ON public.customer_signups FOR SELECT
  USING (user_id IS NULL);
