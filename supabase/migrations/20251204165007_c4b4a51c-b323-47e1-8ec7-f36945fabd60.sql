-- 1. Create a new public bucket called 'blog-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- 2. Allow public access to read images
CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- 3. Allow anyone to upload (for API/service role access)
CREATE POLICY "Allow uploads to blog-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

-- 4. Allow deletions (for admin cleanup)
CREATE POLICY "Allow deletions from blog-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images');