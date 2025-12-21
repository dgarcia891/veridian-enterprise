-- Add source_url column to blog_posts table
ALTER TABLE public.blog_posts
ADD COLUMN source_url text;