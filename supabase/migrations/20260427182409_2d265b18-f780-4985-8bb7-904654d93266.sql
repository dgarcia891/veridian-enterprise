-- 1. Fix call_logs: restrict INSERT to service_role only
DROP POLICY IF EXISTS "Service role can insert call logs" ON public.call_logs;

CREATE POLICY "Service role can insert call logs"
ON public.call_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- 2. Strengthen analytics_events IP scrubbing: nullify for ALL non-service writes
CREATE OR REPLACE FUNCTION public.scrub_analytics_event_ip()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only the service_role (trusted server-side code / edge functions) may set ip_address.
  -- Any client-supplied IP from anon or authenticated users is discarded.
  IF auth.role() IS DISTINCT FROM 'service_role' THEN
    NEW.ip_address := NULL;
  END IF;
  RETURN NEW;
END;
$function$;

-- Ensure trigger exists (idempotent)
DROP TRIGGER IF EXISTS scrub_analytics_event_ip_trigger ON public.analytics_events;
CREATE TRIGGER scrub_analytics_event_ip_trigger
BEFORE INSERT ON public.analytics_events
FOR EACH ROW EXECUTE FUNCTION public.scrub_analytics_event_ip();