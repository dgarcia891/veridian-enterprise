import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("sessionId is required");

    const stripeMode = Deno.env.get("STRIPE_MODE") || "test";
    const stripeKey = stripeMode === "live"
      ? Deno.env.get("STRIPE_SECRET_KEY_LIVE")
      : Deno.env.get("STRIPE_SECRET_KEY_TEST");
    if (!stripeKey) throw new Error("Stripe key not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      throw new Error("Session not found or payment not completed");
    }

    // Look up the signup record using the signup_id from metadata
    const signupId = session.metadata?.signup_id;
    let signupData = null;

    if (signupId) {
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        { auth: { persistSession: false } }
      );

      const { data } = await supabaseAdmin
        .from("customer_signups")
        .select("id, email, company_name, contact_name, industry, plan_type, phone")
        .eq("id", signupId)
        .single();

      signupData = data;
    }

    return new Response(JSON.stringify({
      email: session.customer_email || signupData?.email || "",
      companyName: signupData?.company_name || "",
      contactName: signupData?.contact_name || "",
      industry: signupData?.industry || "",
      planType: signupData?.plan_type || "",
      phone: signupData?.phone || "",
      signupId: signupId || null,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
