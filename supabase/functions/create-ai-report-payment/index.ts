import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_ATTEMPTS = 5; // Maximum 5 attempts per hour

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP address
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
      || req.headers.get("x-real-ip") 
      || "unknown";

    if (clientIp === "unknown") {
      return new Response(
        JSON.stringify({ error: "Unable to identify client" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Initialize Supabase client for rate limiting
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check rate limit
    const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW).toISOString();
    
    const { data: existingLimit, error: fetchError } = await supabase
      .from("payment_rate_limits")
      .select("*")
      .eq("ip_address", clientIp)
      .gte("last_attempt_at", oneHourAgo)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Rate limit check error:", fetchError);
    }

    // Enforce rate limit
    if (existingLimit && existingLimit.attempt_count >= MAX_ATTEMPTS) {
      const timeRemaining = Math.ceil(
        (new Date(existingLimit.first_attempt_at).getTime() + RATE_LIMIT_WINDOW - Date.now()) / 1000 / 60
      );
      
      return new Response(
        JSON.stringify({ 
          error: `Rate limit exceeded. Please try again in ${timeRemaining} minutes.`,
          retryAfter: timeRemaining 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
      );
    }

    // Update or create rate limit entry
    if (existingLimit) {
      await supabase
        .from("payment_rate_limits")
        .update({
          attempt_count: existingLimit.attempt_count + 1,
          last_attempt_at: new Date().toISOString(),
        })
        .eq("id", existingLimit.id);
    } else {
      await supabase
        .from("payment_rate_limits")
        .insert({
          ip_address: clientIp,
          attempt_count: 1,
          first_attempt_at: new Date().toISOString(),
          last_attempt_at: new Date().toISOString(),
        });
    }

    // Clean up old rate limit entries (non-critical operation)
    try {
      await supabase.rpc("cleanup_old_rate_limits");
    } catch (cleanupError) {
      // Log but don't fail - cleanup is a background operation
      console.error("Rate limit cleanup error (non-fatal)");
      
      // Log to monitoring table
      await supabase.from("edge_function_errors").insert({
        function_name: "create-ai-report-payment",
        error_type: "rate_limit_cleanup_failed",
        error_message: cleanupError instanceof Error ? cleanupError.message : "Unknown cleanup error",
        metadata: { client_ip: clientIp }
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Create a one-time payment session with IP metadata
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1SPTbhBAEKQ21BqoB8l0sYXN",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/ai-insight?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/ai-insight`,
      metadata: {
        client_ip: clientIp,
        created_at: new Date().toISOString(),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment creation error");
    return new Response(
      JSON.stringify({ error: "Unable to create payment session. Please try again." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
