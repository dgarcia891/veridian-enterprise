-- Add ip_address column to analytics_events table
ALTER TABLE public.analytics_events 
ADD COLUMN ip_address text;

-- Create index on ip_address for faster lookups
CREATE INDEX idx_analytics_events_ip_address ON public.analytics_events(ip_address);