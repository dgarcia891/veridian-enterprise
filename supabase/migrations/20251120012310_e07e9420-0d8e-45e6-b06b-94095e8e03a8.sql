-- Create table to track website scans for rate limiting
CREATE TABLE IF NOT EXISTS public.website_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_url TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.website_scans ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to manage scans
CREATE POLICY "Service role can manage website scans"
ON public.website_scans
FOR ALL
USING (true)
WITH CHECK (true);

-- Create indexes for efficient lookups
CREATE INDEX idx_website_scans_url ON public.website_scans(website_url);
CREATE INDEX idx_website_scans_ip ON public.website_scans(ip_address);
CREATE INDEX idx_website_scans_created_at ON public.website_scans(created_at);

-- Function to cleanup old scan records (older than 30 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_website_scans()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  DELETE FROM public.website_scans
  WHERE created_at < now() - interval '30 days';
$$;