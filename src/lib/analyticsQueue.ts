import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

/**
 * Module-level analytics event queue with debounced batch flush.
 *
 * Goal: collapse N individual INSERT round trips into a single multi-row
 * insert, reducing write pressure on `analytics_events` (a hot table that
 * the admin dashboard also reads from).
 *
 * Behavior:
 *  - Events are buffered in memory.
 *  - A flush is scheduled FLUSH_DELAY_MS after the first queued event.
 *  - Flush is also forced when the buffer reaches MAX_BATCH_SIZE.
 *  - On `pagehide` / `visibilitychange=hidden`, we flush synchronously so
 *    in-flight events aren't lost when the user navigates away.
 */

export interface QueuedAnalyticsEvent {
  event_name: string;
  event_category: string;
  page_path: string | null;
  referrer: string | null;
  user_agent: string | null;
  session_id: string | null;
  metadata: Json | null;
  ip_address: string | null;
}

const FLUSH_DELAY_MS = 1500;
const MAX_BATCH_SIZE = 25;

let buffer: QueuedAnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let listenersInstalled = false;

const installFlushListeners = () => {
  if (listenersInstalled || typeof window === "undefined") return;
  listenersInstalled = true;
  // Best-effort flush before the page is unloaded / hidden.
  window.addEventListener("pagehide", () => {
    void flushAnalyticsQueue();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      void flushAnalyticsQueue();
    }
  });
};

export const flushAnalyticsQueue = async (): Promise<void> => {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (buffer.length === 0) return;

  const batch = buffer;
  buffer = [];

  try {
    const { error } = await supabase.from("analytics_events").insert(batch);
    if (error) {
      console.error("Analytics batch insert failed:", error);
    }
  } catch (error) {
    console.error("Analytics batch insert threw:", error);
  }
};

export const enqueueAnalyticsEvent = (event: QueuedAnalyticsEvent): void => {
  installFlushListeners();
  buffer.push(event);

  if (buffer.length >= MAX_BATCH_SIZE) {
    void flushAnalyticsQueue();
    return;
  }

  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushTimer = null;
      void flushAnalyticsQueue();
    }, FLUSH_DELAY_MS);
  }
};
