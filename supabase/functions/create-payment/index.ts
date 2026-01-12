import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { signupId, planType, email } = await req.json();
    
    if (!signupId || !planType || !email) {
      throw new Error("Invalid request parameters");
    }

    // Validate that the signup exists and matches the provided email
    const { data: signup, error: signupError } = await supabaseClient
      .from("customer_signups")
      .select("email, payment_status")
      .eq("id", signupId)
      .maybeSingle();

    if (signupError) {
      throw new Error("Unable to process payment request");
    }

    if (!signup) {
      throw new Error("Invalid signup reference");
    }

    if (signup.email !== email) {
      throw new Error("Invalid signup reference");
    }

    // Check if payment already initiated
    if (signup.payment_status !== "pending") {
      throw new Error("Payment already initiated for this signup");
    }

    // Determine which Stripe key to use based on mode
    const stripeMode = Deno.env.get("STRIPE_MODE") || "test";
    const stripeKey = stripeMode === "live" 
      ? Deno.env.get("STRIPE_SECRET_KEY_LIVE")
      : Deno.env.get("STRIPE_SECRET_KEY_TEST");
    
    if (!stripeKey) {
      throw new Error("Payment service configuration error");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId = customers.data.length > 0 ? customers.data[0].id : undefined;

    // Create customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({ email });
      customerId = customer.id;
    }

    // Determine price ID based on plan type
    const isAnnual = planType === "annual";
    const isMedical = planType === "medical";
    
    let priceId: string;
    let mode: "payment" | "subscription";
    
    if (isMedical) {
      priceId = "price_1SMI1kBAEKQ21Bqovt7fVaiE"; // Medical/Healthcare - $10,200/year
      mode = "subscription";
    } else if (isAnnual) {
      priceId = "price_1SMI1BBAEKQ21BqoFmlpkF41"; // Annual - $3,600/year
      mode = "subscription";
    } else {
      priceId = "price_1SMHz0BAEKQ21Bqow3FGFyWS"; // Monthly - $1,050 one-time
      mode = "payment";
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/signup`,
      metadata: {
        signup_id: signupId,
        plan_type: planType,
      },
    });

    // Update signup record
    await supabaseClient
      .from("customer_signups")
      .update({
        stripe_customer_id: customerId,
        payment_status: "pending",
      })
      .eq("id", signupId);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment creation failed");
    
    // Return generic error message to client
    const userMessage = error instanceof Error && error.message.includes("Invalid")
      ? error.message
      : "Payment processing failed. Please try again or contact support.";
    
    return new Response(
      JSON.stringify({ error: userMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});