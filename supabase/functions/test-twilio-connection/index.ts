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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await supabaseAdmin
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "twilio_config")
      .maybeSingle();

    if (error) throw new Error(`Failed to load config: ${error.message}`);
    if (!data?.setting_value) throw new Error("Twilio configuration not found. Please save your credentials first.");

    const config = data.setting_value as any;
    const { accountSid, authToken } = config;

    if (!accountSid || !authToken) {
      throw new Error("Account SID and Auth Token are required.");
    }

    const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
      headers: {
        Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
      },
    });

    if (!twilioRes.ok) {
      const body = await twilioRes.text();
      throw new Error(`Twilio API error (${twilioRes.status}): ${body}`);
    }

    const account = await twilioRes.json();

    return new Response(
      JSON.stringify({ success: true, friendlyName: account.friendly_name, accountSid: account.sid, status: account.status }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
