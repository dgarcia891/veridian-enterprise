
-- Ensure RLS is enabled
ALTER TABLE public.ai_audit_submissions ENABLE ROW LEVEL SECURITY;

-- Grant INSERT privilege to anon role
GRANT INSERT ON public.ai_audit_submissions TO anon;

-- Grant USAGE on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
