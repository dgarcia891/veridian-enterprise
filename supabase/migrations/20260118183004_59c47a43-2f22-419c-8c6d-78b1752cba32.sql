-- Allow admins to delete analytics events (for IP cleanup feature)
CREATE POLICY "Admins can delete analytics"
ON public.analytics_events
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));