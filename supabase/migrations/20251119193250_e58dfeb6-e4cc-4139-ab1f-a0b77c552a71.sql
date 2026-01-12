-- Add website_url and website_analysis columns to ai_audit_submissions table
ALTER TABLE public.ai_audit_submissions 
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS website_analysis JSONB;

-- Add comment for documentation
COMMENT ON COLUMN public.ai_audit_submissions.website_url IS 'The business website URL provided by the user';
COMMENT ON COLUMN public.ai_audit_submissions.website_analysis IS 'AI-generated analysis of the website including opportunities, experience gaps, and content insights';
