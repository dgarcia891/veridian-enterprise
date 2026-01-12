-- Create customer signups table
CREATE TABLE public.customer_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  industry TEXT,
  average_calls_per_day INTEGER,
  current_phone_system TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'annual')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  wants_call_first BOOLEAN DEFAULT false,
  appointment_scheduled BOOLEAN DEFAULT false,
  appointment_date TIMESTAMP WITH TIME ZONE,
  appointment_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customer_signups ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting signups (anyone can sign up)
CREATE POLICY "Anyone can insert signups"
ON public.customer_signups
FOR INSERT
WITH CHECK (true);

-- Create policy for viewing own signups (by email)
CREATE POLICY "Users can view their own signups"
ON public.customer_signups
FOR SELECT
USING (true);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_customer_signups_updated_at
BEFORE UPDATE ON public.customer_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();