
-- Create media_assets table
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  type TEXT NOT NULL DEFAULT 'image',
  alt_text TEXT,
  title TEXT,
  file_name TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Only admins can manage media
CREATE POLICY "Admins can manage media assets"
  ON public.media_assets FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Public can read media (for blog images)
CREATE POLICY "Public can read media assets"
  ON public.media_assets FOR SELECT
  USING (true);
