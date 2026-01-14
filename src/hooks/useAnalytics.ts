import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

// GA4 Measurement ID
const GA4_MEASUREMENT_ID = "G-Z6B8376C8G";

// Generate a session ID for grouping events
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

interface TrackEventOptions {
  category?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export const useAnalytics = () => {
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const initialized = useRef(false);

  // Initialize GA4 and fetch IP on mount
  useEffect(() => {
    const isIgnored = localStorage.getItem("ignore_analytics") === "true";

    // Fetch IP address
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Failed to fetch IP:', error);
      }
    };
    fetchIp();

    if (!initialized.current && GA4_MEASUREMENT_ID && !isIgnored) {
      // @ts-ignore
      window.gtagConfig?.(GA4_MEASUREMENT_ID);
      initialized.current = true;
    }
  }, []);

  const trackEvent = useCallback(
    async (eventName: string, options: TrackEventOptions = {}) => {
      const isIgnored = localStorage.getItem("ignore_analytics") === "true";
      if (isIgnored) {
        console.log(`[Analytics Ignored] ${eventName}`, options);
        return;
      }

      const { category = "general", metadata = {} } = options;

      // Send to GA4 if configured
      if (GA4_MEASUREMENT_ID && typeof window !== "undefined") {
        // @ts-ignore
        window.gtag?.("event", eventName, {
          event_category: category,
          ...metadata,
        });
      }

      // Send to our database
      try {
        await supabase.from("analytics_events").insert([{
          event_name: eventName,
          event_category: category,
          page_path: window.location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          session_id: getSessionId(),
          metadata: metadata as Json,
          ip_address: ipAddress,
        }]);
      } catch (error) {
        console.error("Failed to track event:", error);
      }
    },
    [ipAddress]
  );

  const trackPageView = useCallback(
    (pageName?: string) => {
      trackEvent("page_view", {
        category: "navigation",
        metadata: {
          page_name: pageName || document.title,
          page_path: window.location.pathname,
        },
      });
    },
    [trackEvent]
  );

  const trackConsultationBooked = useCallback(
    (source?: string) => {
      trackEvent("consultation_booked", {
        category: "conversion",
        metadata: { source },
      });
    },
    [trackEvent]
  );

  const trackROICalculatorUsed = useCallback(
    (values: Record<string, string | number | boolean | null>) => {
      trackEvent("roi_calculator_used", {
        category: "engagement",
        metadata: values,
      });
    },
    [trackEvent]
  );

  const trackBlogView = useCallback(
    (slug: string, title: string) => {
      trackEvent("blog_view", {
        category: "content",
        metadata: { slug, title },
      });
    },
    [trackEvent]
  );

  const trackCTAClick = useCallback(
    (ctaName: string, location: string) => {
      trackEvent("cta_click", {
        category: "engagement",
        metadata: { cta_name: ctaName, location },
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackPageView,
    trackConsultationBooked,
    trackROICalculatorUsed,
    trackBlogView,
    trackCTAClick,
  };
};
