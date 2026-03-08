import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { onboardingId } = await req.json();
    if (!onboardingId) throw new Error("onboardingId is required");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Load Twilio config
    const { data: configData, error: configErr } = await supabaseAdmin
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "twilio_config")
      .maybeSingle();

    if (configErr) throw new Error(`Config load failed: ${configErr.message}`);
    if (!configData?.setting_value) throw new Error("Twilio not configured.");

    const config = configData.setting_value as any;
    if (!config.enabled) throw new Error("Twilio provisioning is disabled.");
    if (!config.accountSid || !config.authToken) throw new Error("Twilio credentials missing.");

    const { accountSid, authToken, defaultAreaCode } = config;
    const authHeader = "Basic " + btoa(`${accountSid}:${authToken}`);

    // Search for available numbers
    const searchParams = new URLSearchParams({
      VoiceEnabled: "true",
      SmsEnabled: "true",
      Limit: "1",
    });
    if (defaultAreaCode) searchParams.set("AreaCode", defaultAreaCode);

    const searchRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/US/Local.json?${searchParams}`,
      { headers: { Authorization: authHeader } }
    );

    if (!searchRes.ok) {
      const body = await searchRes.text();
      throw new Error(`Failed to search numbers: ${body}`);
    }

    const searchData = await searchRes.json();
    if (!searchData.available_phone_numbers?.length) {
      throw new Error("No phone numbers available" + (defaultAreaCode ? ` for area code ${defaultAreaCode}` : "") + ". Try a different area code.");
    }

    const numberToBuy = searchData.available_phone_numbers[0].phone_number;

    // Purchase the number
    const purchaseRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ PhoneNumber: numberToBuy }),
      }
    );

    if (!purchaseRes.ok) {
      const body = await purchaseRes.text();
      throw new Error(`Failed to purchase number: ${body}`);
    }

    const purchased = await purchaseRes.json();
    const phoneNumber = purchased.phone_number;

    // Update onboarding record
    const { error: updateErr } = await supabaseAdmin
      .from("customer_onboarding")
      .update({
        phone_number: phoneNumber,
        provisioning_status: "ready",
        updated_at: new Date().toISOString(),
      })
      .eq("id", onboardingId);

    if (updateErr) {
      console.error("Failed to update onboarding record:", updateErr);
    }

    return new Response(
      JSON.stringify({ success: true, phoneNumber }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Provision error:", err.message);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
