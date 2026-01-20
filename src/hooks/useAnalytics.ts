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
      // @ts-expect-error - gtag is defined globally by GA4
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
        // @ts-expect-error - gtag is defined globally by GA4
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

  // =========================================
  // Cal.com Booking Funnel Tracking (FR-005)
  // =========================================

  const trackCalendarOpened = useCallback(
    (source: string) => {
      trackEvent("calendar_opened", {
        category: "booking_funnel",
        metadata: { source },
      });
    },
    [trackEvent]
  );

  const trackCalendarLoaded = useCallback(
    (source: string) => {
      trackEvent("calendar_loaded", {
        category: "booking_funnel",
        metadata: { source },
      });
    },
    [trackEvent]
  );

  const trackCalendarClosed = useCallback(
    (source: string) => {
      trackEvent("calendar_closed", {
        category: "booking_funnel",
        metadata: { source },
      });
    },
    [trackEvent]
  );

  const trackDateSelected = useCallback(
    (date?: string) => {
      trackEvent("date_selected", {
        category: "booking_funnel",
        metadata: { date: date || "unknown" },
      });
    },
    [trackEvent]
  );

  const trackTimeSlotSelected = useCallback(
    (timeSlot?: string) => {
      trackEvent("time_slot_selected", {
        category: "booking_funnel",
        metadata: { time_slot: timeSlot || "unknown" },
      });
    },
    [trackEvent]
  );

  const trackBookingFormOpened = useCallback(
    () => {
      trackEvent("booking_form_opened", {
        category: "booking_funnel",
        metadata: {},
      });
    },
    [trackEvent]
  );

  const trackBookingCompleted = useCallback(
    (bookingId?: string, email?: string) => {
      trackEvent("booking_completed", {
        category: "booking_funnel",
        metadata: { booking_id: bookingId || "unknown", email: email || "unknown" },
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
    // Cal.com Booking Funnel (FR-005)
    trackCalendarOpened,
    trackCalendarLoaded,
    trackCalendarClosed,
    trackDateSelected,
    trackTimeSlotSelected,
    trackBookingFormOpened,
    trackBookingCompleted,
  };
};

