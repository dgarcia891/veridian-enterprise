
-- 1. Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  company_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Add user_id to customer_onboarding
ALTER TABLE public.customer_onboarding ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS: users can read/update their own onboarding rows
CREATE POLICY "Users can view own onboarding" ON public.customer_onboarding
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding" ON public.customer_onboarding
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding" ON public.customer_onboarding
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all onboarding" ON public.customer_onboarding
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 3. Call logs table (placeholder for Retell integration)
CREATE TABLE public.call_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id uuid REFERENCES public.customer_onboarding(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  caller_number text,
  duration_seconds integer DEFAULT 0,
  status text DEFAULT 'completed',
  recording_url text,
  summary text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own call logs" ON public.call_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all call logs" ON public.call_logs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Service role insert for edge functions
CREATE POLICY "Service role can insert call logs" ON public.call_logs
  FOR INSERT WITH CHECK (true);
