-- Add SEO columns to blog_posts table
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT[],
ADD COLUMN IF NOT EXISTS faq_schema JSONB;

-- Update RLS if necessary (it shouldn't be as it's just adding columns to existing table)
-- But ensuring types are correct for existing draft/published split.
