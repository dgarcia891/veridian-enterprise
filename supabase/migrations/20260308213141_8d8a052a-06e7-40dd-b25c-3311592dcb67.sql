
CREATE TABLE public.customer_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid REFERENCES public.customer_signups(id) ON DELETE CASCADE,
  business_name text,
  business_hours jsonb DEFAULT '{}',
  greeting_message text,
  services_offered text[],
  faq_entries jsonb DEFAULT '[]',
  voicemail_enabled boolean DEFAULT true,
  preferred_voice text DEFAULT 'professional-female',
  phone_number text,
  retell_agent_id text,
  provisioning_status text DEFAULT 'pending',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.customer_onboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.customer_onboarding FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admins can view signups"
ON public.customer_signups FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
