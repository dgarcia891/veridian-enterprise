-- Create table to track payment attempt rate limits by IP
CREATE TABLE IF NOT EXISTS public.payment_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast IP lookups
CREATE INDEX idx_payment_rate_limits_ip ON public.payment_rate_limits(ip_address);
CREATE INDEX idx_payment_rate_limits_last_attempt ON public.payment_rate_limits(last_attempt_at);

-- Enable RLS (no select policies needed - only edge functions access this)
ALTER TABLE public.payment_rate_limits ENABLE ROW LEVEL SECURITY;

-- Function to clean up old rate limit entries (older than 2 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.payment_rate_limits
  WHERE last_attempt_at < now() - interval '2 hours';
$$;