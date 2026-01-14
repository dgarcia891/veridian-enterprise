-- Add pain points field to qualification_submissions table
ALTER TABLE public.qualification_submissions 
ADD COLUMN IF NOT EXISTS selected_pain_points TEXT[] DEFAULT '{}';

-- Add index for searching by pain points
CREATE INDEX IF NOT EXISTS idx_qualification_pain_points 
  ON public.qualification_submissions USING GIN(selected_pain_points);