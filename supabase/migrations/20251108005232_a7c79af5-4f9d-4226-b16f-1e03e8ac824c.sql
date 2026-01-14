-- Create edge function error logs table
CREATE TABLE public.edge_function_errors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  function_name TEXT NOT NULL,
  error_type TEXT NOT NULL,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_edge_function_errors_created_at ON public.edge_function_errors(created_at DESC);
CREATE INDEX idx_edge_function_errors_function_name ON public.edge_function_errors(function_name);
CREATE INDEX idx_edge_function_errors_error_type ON public.edge_function_errors(error_type);

-- Enable RLS
ALTER TABLE public.edge_function_errors ENABLE ROW LEVEL SECURITY;

-- Only admins can view error logs (adjust based on your needs)
CREATE POLICY "Service role can manage error logs"
ON public.edge_function_errors
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Function to clean up old error logs (older than 30 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_error_logs()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  DELETE FROM public.edge_function_errors
  WHERE created_at < now() - interval '30 days';
$$;