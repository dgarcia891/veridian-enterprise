
ALTER TABLE public.customer_signups ADD COLUMN user_id uuid REFERENCES auth.users(id);
CREATE INDEX idx_customer_signups_user_id ON public.customer_signups(user_id);

-- Allow users to read their own signup
CREATE POLICY "Users can view own signup" ON public.customer_signups
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own signup (to link user_id)
CREATE POLICY "Users can update own signup" ON public.customer_signups
  FOR UPDATE USING (auth.uid() = user_id);
