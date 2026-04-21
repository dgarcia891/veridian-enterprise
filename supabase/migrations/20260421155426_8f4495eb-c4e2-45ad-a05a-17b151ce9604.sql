
-- 1. BLOG IMAGES STORAGE: drop overly permissive policies, restrict to admins
DROP POLICY IF EXISTS "Allow uploads to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletions from blog-images" ON storage.objects;

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- 2. ANALYTICS EVENTS: strip client-supplied ip_address for anon inserts
CREATE OR REPLACE FUNCTION public.scrub_analytics_event_ip()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'anon' THEN
    NEW.ip_address := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS scrub_analytics_event_ip_trigger ON public.analytics_events;
CREATE TRIGGER scrub_analytics_event_ip_trigger
BEFORE INSERT ON public.analytics_events
FOR EACH ROW
EXECUTE FUNCTION public.scrub_analytics_event_ip();

-- 3. REALTIME CHANNEL AUTHORIZATION: restrict to admins
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
             WHERE n.nspname = 'realtime' AND c.relname = 'messages') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Admins can subscribe to realtime channels" ON realtime.messages';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can broadcast to realtime channels" ON realtime.messages';

    EXECUTE $POL$
      CREATE POLICY "Admins can subscribe to realtime channels"
      ON realtime.messages FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    $POL$;

    EXECUTE $POL$
      CREATE POLICY "Admins can broadcast to realtime channels"
      ON realtime.messages FOR INSERT
      TO authenticated
      WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role))
    $POL$;
  END IF;
END$$;
