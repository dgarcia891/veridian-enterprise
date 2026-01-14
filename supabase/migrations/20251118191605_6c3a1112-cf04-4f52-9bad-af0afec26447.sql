-- Add industry field to qualification_submissions table
ALTER TABLE public.qualification_submissions 
ADD COLUMN IF NOT EXISTS industry TEXT;

-- Create index for searching by industry
CREATE INDEX IF NOT EXISTS idx_qualification_industry 
  ON public.qualification_submissions(industry);