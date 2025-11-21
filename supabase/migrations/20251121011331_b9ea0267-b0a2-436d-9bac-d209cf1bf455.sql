-- Grant INSERT permission to anon role on ai_audit_submissions table
GRANT INSERT ON public.ai_audit_submissions TO anon;

-- Grant USAGE on the sequence for the id column (if auto-generated)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;