-- 1. Indexes on analytics_events for faster admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_category_created
  ON public.analytics_events (event_category, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created
  ON public.analytics_events (event_name, created_at DESC);

-- 2. Drop deprecated AI blog tables
DROP TABLE IF EXISTS public.ai_blog_queue CASCADE;
DROP TABLE IF EXISTS public.ai_blog_config CASCADE;

-- 3. Remove analytics_events from realtime publication
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'analytics_events'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.analytics_events';
  END IF;
END $$;

-- 4. Funnel stats RPC
CREATE OR REPLACE FUNCTION public.get_funnel_stats(date_from timestamptz DEFAULT NULL)
RETURNS TABLE (
  stage text,
  unique_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    event_name AS stage,
    COUNT(DISTINCT COALESCE(
      metadata->>'funnel_id',
      metadata->>'funnel_email',
      'unknown'
    ))::bigint AS unique_count
  FROM public.analytics_events
  WHERE event_category = 'conversion_funnel'
    AND (date_from IS NULL OR created_at >= date_from)
    AND has_role(auth.uid(), 'admin'::app_role)
  GROUP BY event_name;
$$;

GRANT EXECUTE ON FUNCTION public.get_funnel_stats(timestamptz) TO authenticated;

-- 5. Blog view stats RPC
CREATE OR REPLACE FUNCTION public.get_blog_view_stats(date_from timestamptz DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN jsonb_build_object(
      'top_posts', '[]'::jsonb,
      'daily_trends', '[]'::jsonb,
      'categories', '[]'::jsonb,
      'total_views', 0
    );
  END IF;

  WITH views AS (
    SELECT
      COALESCE(metadata->>'slug', 'unknown') AS slug,
      COALESCE(metadata->>'title', metadata->>'slug', 'unknown') AS title,
      created_at
    FROM public.analytics_events
    WHERE event_name = 'blog_view'
      AND (date_from IS NULL OR created_at >= date_from)
  ),
  per_slug AS (
    SELECT slug, MAX(title) AS title, COUNT(*)::bigint AS views
    FROM views
    GROUP BY slug
  ),
  top_posts AS (
    SELECT slug, title, views
    FROM per_slug
    ORDER BY views DESC
    LIMIT 10
  ),
  daily AS (
    SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS date,
           COUNT(*)::bigint AS views
    FROM views
    GROUP BY 1
    ORDER BY 1
  ),
  cat AS (
    SELECT COALESCE(bp.category, 'Uncategorized') AS category,
           SUM(ps.views)::bigint AS views
    FROM per_slug ps
    LEFT JOIN public.blog_posts bp ON bp.slug = ps.slug
    GROUP BY 1
    ORDER BY 2 DESC
  )
  SELECT jsonb_build_object(
    'top_posts', COALESCE((SELECT jsonb_agg(to_jsonb(t)) FROM top_posts t), '[]'::jsonb),
    'daily_trends', COALESCE((SELECT jsonb_agg(to_jsonb(d)) FROM daily d), '[]'::jsonb),
    'categories', COALESCE((SELECT jsonb_agg(to_jsonb(c)) FROM cat c), '[]'::jsonb),
    'total_views', COALESCE((SELECT SUM(views) FROM per_slug), 0)
  )
  INTO result;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_blog_view_stats(timestamptz) TO authenticated;

-- 6. Cleanup function for cron.job_run_details
CREATE OR REPLACE FUNCTION public.cleanup_old_cron_history()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM cron.job_run_details
  WHERE end_time < now() - interval '7 days'
     OR (end_time IS NULL AND start_time < now() - interval '7 days');
$$;

-- 7. Cleanup function for net._http_response
CREATE OR REPLACE FUNCTION public.cleanup_old_http_responses()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM net._http_response
  WHERE created < now() - interval '1 day';
$$;

-- 8. Schedule cleanup jobs (idempotent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-cron-history-daily') THEN
    PERFORM cron.unschedule('cleanup-cron-history-daily');
  END IF;
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-http-responses-daily') THEN
    PERFORM cron.unschedule('cleanup-http-responses-daily');
  END IF;
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-rate-limits-hourly') THEN
    PERFORM cron.unschedule('cleanup-rate-limits-hourly');
  END IF;
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-website-scans-daily') THEN
    PERFORM cron.unschedule('cleanup-website-scans-daily');
  END IF;
END $$;

SELECT cron.schedule(
  'cleanup-cron-history-daily',
  '0 3 * * *',
  $$ SELECT public.cleanup_old_cron_history(); $$
);

SELECT cron.schedule(
  'cleanup-http-responses-daily',
  '15 3 * * *',
  $$ SELECT public.cleanup_old_http_responses(); $$
);

SELECT cron.schedule(
  'cleanup-rate-limits-hourly',
  '0 * * * *',
  $$ SELECT public.cleanup_old_rate_limits(); $$
);

SELECT cron.schedule(
  'cleanup-website-scans-daily',
  '0 4 * * *',
  $$ SELECT public.cleanup_old_website_scans(); $$
);

-- 9. Reduce publish-scheduled-posts cron from */5 to */15
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT jobid FROM cron.job
    WHERE jobname IN ('publish-scheduled-posts', 'publish-scheduled-blog-posts')
       OR command ILIKE '%publish-scheduled-posts%'
  LOOP
    PERFORM cron.alter_job(job_id := r.jobid, schedule := '*/15 * * * *');
  END LOOP;
END $$;