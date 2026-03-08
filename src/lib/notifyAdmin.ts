import { supabase } from "@/integrations/supabase/client";

/**
 * Fire-and-forget email notification via the notify-admin-email edge function.
 * Never throws — failures are silently logged so they don't block the user flow.
 */
export async function notifyAdmin(
  notificationType: "new_lead" | "buyer_notification" | "buyer_inquiry" | "test",
  payload: Record<string, unknown> = {}
): Promise<void> {
  try {
    const body: Record<string, unknown> = { notificationType };

    switch (notificationType) {
      case "new_lead":
        body.leadData = payload;
        break;
      case "buyer_notification":
        body.eventData = payload;
        break;
      case "buyer_inquiry":
        body.buyerInquiry = payload;
        break;
      // "test" needs no extra data
    }

    await supabase.functions.invoke("notify-admin-email", { body });
  } catch (err) {
    console.error("[notifyAdmin] silent failure:", err);
  }
}
