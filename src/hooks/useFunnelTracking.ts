import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

/**
 * Conversion funnel stages (ordered):
 * 1. page_visit        – User lands on an audit/ROI page
 * 2. audit_started     – User begins filling out the audit form
 * 3. audit_completed   – User submits the audit form and sees results
 * 4. calendar_opened   – User opens the Cal.com booking modal/page
 * 5. booking_completed – User successfully books a consultation
 * 6. payment_completed – User completes a payment/signup
 */

export type FunnelStage =
  | "blog_visit"
  | "page_visit"
  | "audit_started"
  | "audit_completed"
  | "calendar_opened"
  | "booking_completed"
  | "payment_completed";

const FUNNEL_ID_KEY = "conversion_funnel_id";
const FUNNEL_EMAIL_KEY = "conversion_funnel_email";

const getFunnelId = (): string => {
  let funnelId = localStorage.getItem(FUNNEL_ID_KEY);
  if (!funnelId) {
    funnelId = `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(FUNNEL_ID_KEY, funnelId);
  }
  return funnelId;
};

export const useFunnelTracking = () => {
  const setFunnelEmail = useCallback((email: string) => {
    if (email) {
      localStorage.setItem(FUNNEL_EMAIL_KEY, email);
    }
  }, []);

  const trackFunnelStage = useCallback(
    async (
      stage: FunnelStage,
      metadata: Record<string, string | number | boolean | null> = {}
    ) => {
      const isIgnored = localStorage.getItem("ignore_analytics") === "true";
      if (isIgnored) return;

      const funnelId = getFunnelId();
      const funnelEmail = localStorage.getItem(FUNNEL_EMAIL_KEY) || null;

      try {
        await supabase.from("analytics_events").insert([
          {
            event_name: `funnel_${stage}`,
            event_category: "conversion_funnel",
            page_path: window.location.pathname,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent,
            session_id: sessionStorage.getItem("analytics_session_id") || null,
            metadata: {
              ...metadata,
              funnel_id: funnelId,
              funnel_email: funnelEmail,
              funnel_stage: stage,
            } as Json,
          },
        ]);
      } catch (error) {
        console.error("Failed to track funnel stage:", error);
      }
    },
    []
  );

  const trackPageVisit = useCallback(
    (source: string) => trackFunnelStage("page_visit", { source }),
    [trackFunnelStage]
  );

  const trackAuditStarted = useCallback(
    (auditType: string) => trackFunnelStage("audit_started", { audit_type: auditType }),
    [trackFunnelStage]
  );

  const trackAuditCompleted = useCallback(
    (auditType: string, email?: string) => {
      if (email) setFunnelEmail(email);
      return trackFunnelStage("audit_completed", { audit_type: auditType });
    },
    [trackFunnelStage, setFunnelEmail]
  );

  const trackCalendarOpened = useCallback(
    (source: string) => trackFunnelStage("calendar_opened", { source }),
    [trackFunnelStage]
  );

  const trackBookingCompleted = useCallback(
    (bookingId?: string, email?: string) => {
      if (email) setFunnelEmail(email);
      return trackFunnelStage("booking_completed", {
        booking_id: bookingId || "unknown",
      });
    },
    [trackFunnelStage, setFunnelEmail]
  );

  const trackPaymentCompleted = useCallback(
    (planType?: string, email?: string) => {
      if (email) setFunnelEmail(email);
      return trackFunnelStage("payment_completed", {
        plan_type: planType || "unknown",
      });
    },
    [trackFunnelStage, setFunnelEmail]
  );

  return {
    setFunnelEmail,
    trackFunnelStage,
    trackPageVisit,
    trackAuditStarted,
    trackAuditCompleted,
    trackCalendarOpened,
    trackBookingCompleted,
    trackPaymentCompleted,
  };
};
