-- Create site_posts table for external content
CREATE TABLE IF NOT EXISTS public.site_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id UUID NOT NULL UNIQUE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content_html TEXT NOT NULL,
    excerpt TEXT,
    meta_title TEXT,
    meta_description TEXT,
    tags TEXT[],
    featured_image_url TEXT,
    featured_image_alt TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'archived')),
    published_at TIMESTAMPTZ,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_site_posts_external_id ON public.site_posts(external_id);
CREATE INDEX IF NOT EXISTS idx_site_posts_published_at ON public.site_posts(published_at DESC) WHERE status = 'published';

-- Enable RLS
ALTER TABLE public.site_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access (for Edge Functions)
CREATE POLICY "Service role has full access" ON public.site_posts
    AS PERMISSIVE FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_site_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_posts_updated_at
    BEFORE UPDATE ON public.site_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_site_posts_updated_at();
