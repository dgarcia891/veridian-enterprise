
-- Drop the old check constraint and add one that matches the actual plan types
ALTER TABLE public.customer_signups DROP CONSTRAINT customer_signups_plan_type_check;

ALTER TABLE public.customer_signups ADD CONSTRAINT customer_signups_plan_type_check 
  CHECK (plan_type = ANY (ARRAY['starter'::text, 'growth'::text, 'professional'::text, 'monthly'::text, 'annual'::text]));
