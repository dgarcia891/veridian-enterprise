
-- Add scheduled_at column to blog_posts
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

-- Update RLS policy to also allow reading scheduled posts for admins (already covered by admin ALL policy)
-- Update public read policy to exclude scheduled posts
DROP POLICY IF EXISTS "Anyone can read published posts" ON public.blog_posts;
CREATE POLICY "Anyone can read published posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');
