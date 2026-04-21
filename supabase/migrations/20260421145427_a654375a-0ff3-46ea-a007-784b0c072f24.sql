-- 1. Retention: delete analytics_events older than 90 days
CREATE OR REPLACE FUNCTION public.cleanup_old_analytics_events()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.analytics_events
  WHERE created_at < now() - interval '90 days';
$$;

-- Schedule retention nightly at 2:30 AM (idempotent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-analytics-events-daily') THEN
    PERFORM cron.unschedule('cleanup-analytics-events-daily');
  END IF;
END $$;

SELECT cron.schedule(
  'cleanup-analytics-events-daily',
  '30 2 * * *',
  $$ SELECT public.cleanup_old_analytics_events(); $$
);

-- 2. Store anon key in Vault (replace existing secret if present)
DO $$
DECLARE
  existing_id uuid;
BEGIN
  SELECT id INTO existing_id FROM vault.secrets WHERE name = 'project_anon_key' LIMIT 1;
  IF existing_id IS NOT NULL THEN
    PERFORM vault.update_secret(
      existing_id,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpanZxam1ucm1hbWdlcnlzYnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTYyNTUsImV4cCI6MjA3NjU3MjI1NX0.Dr_fVbeWz1d6-AKzVTMEjh9vFXuHm3dziUGGH25fUBc'
    );
  ELSE
    PERFORM vault.create_secret(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpanZxam1ucm1hbWdlcnlzYnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTYyNTUsImV4cCI6MjA3NjU3MjI1NX0.Dr_fVbeWz1d6-AKzVTMEjh9vFXuHm3dziUGGH25fUBc',
      'project_anon_key',
      'Anon JWT used by cron jobs to invoke edge functions'
    );
  END IF;
END $$;

-- 3. Helper: invoke an edge function using the Vault-stored anon key
CREATE OR REPLACE FUNCTION public.invoke_edge_function(function_name text, body jsonb DEFAULT '{}'::jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, vault, net
AS $$
DECLARE
  anon_key text;
  request_id bigint;
BEGIN
  SELECT decrypted_secret INTO anon_key
  FROM vault.decrypted_secrets
  WHERE name = 'project_anon_key'
  LIMIT 1;

  IF anon_key IS NULL THEN
    RAISE EXCEPTION 'project_anon_key not found in Vault';
  END IF;

  SELECT net.http_post(
    url := 'https://kijvqjmnrmamgerysbxv.supabase.co/functions/v1/' || function_name,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key
    ),
    body := body
  ) INTO request_id;

  RETURN request_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.invoke_edge_function(text, jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.invoke_edge_function(text, jsonb) FROM authenticated, anon;

-- 4. Rewrite existing cron jobs to use Vault-backed helper
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-error-logs-daily') THEN
    PERFORM cron.unschedule('cleanup-error-logs-daily');
  END IF;
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'publish-scheduled-posts') THEN
    PERFORM cron.unschedule('publish-scheduled-posts');
  END IF;
END $$;

SELECT cron.schedule(
  'cleanup-error-logs-daily',
  '0 2 * * *',
  $$ SELECT public.invoke_edge_function('cleanup-error-logs', '{"scheduled": true}'::jsonb); $$
);

SELECT cron.schedule(
  'publish-scheduled-posts',
  '*/15 * * * *',
  $$ SELECT public.invoke_edge_function('publish-scheduled-posts', '{}'::jsonb); $$
);