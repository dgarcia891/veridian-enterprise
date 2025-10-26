import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  
  if (!signature) {
    console.error("[stripe-webhook] No signature provided");
    return new Response(JSON.stringify({ error: "No signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Determine which Stripe key and webhook secret to use based on mode
    const stripeMode = Deno.env.get("STRIPE_MODE") || "test";
    const stripeKey = stripeMode === "live" 
      ? Deno.env.get("STRIPE_SECRET_KEY_LIVE")
      : Deno.env.get("STRIPE_SECRET_KEY_TEST");
    
    const webhookSecret = stripeMode === "live"
      ? Deno.env.get("STRIPE_WEBHOOK_SECRET_LIVE")
      : Deno.env.get("STRIPE_WEBHOOK_SECRET_TEST");
    
    if (!stripeKey || !webhookSecret) {
      throw new Error(`Stripe configuration missing for ${stripeMode} mode`);
    }

    console.log(`[stripe-webhook] Processing webhook in ${stripeMode} mode`);

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the raw body for signature verification
    const body = await req.text();
    
    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("[stripe-webhook] Signature verification failed:", err.message);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[stripe-webhook] Event type:", event.type);

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[stripe-webhook] Checkout session completed:", session.id);
        
        const signupId = session.metadata?.signup_id;
        
        if (!signupId) {
          console.error("[stripe-webhook] No signup_id in metadata");
          break;
        }

        // Update the signup record
        const updateData: any = {
          payment_status: "completed",
          stripe_customer_id: session.customer as string,
        };

        // Add payment intent ID for one-time payments
        if (session.mode === "payment" && session.payment_intent) {
          updateData.stripe_payment_intent_id = session.payment_intent as string;
        }

        // Add subscription ID for subscriptions
        if (session.mode === "subscription" && session.subscription) {
          updateData.stripe_subscription_id = session.subscription as string;
        }

        const { error: updateError } = await supabaseClient
          .from("customer_signups")
          .update(updateData)
          .eq("id", signupId);

        if (updateError) {
          console.error("[stripe-webhook] Failed to update signup:", updateError);
          throw updateError;
        }

        console.log("[stripe-webhook] Successfully updated signup:", signupId);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[stripe-webhook] Payment intent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[stripe-webhook] Payment failed:", paymentIntent.id);
        
        // Optionally update the payment status to failed
        const { error: updateError } = await supabaseClient
          .from("customer_signups")
          .update({ payment_status: "failed" })
          .eq("stripe_payment_intent_id", paymentIntent.id);

        if (updateError) {
          console.error("[stripe-webhook] Failed to update payment status:", updateError);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("[stripe-webhook] Subscription cancelled:", subscription.id);
        
        // Update the subscription status
        const { error: updateError } = await supabaseClient
          .from("customer_signups")
          .update({ payment_status: "cancelled" })
          .eq("stripe_subscription_id", subscription.id);

        if (updateError) {
          console.error("[stripe-webhook] Failed to update subscription:", updateError);
        }
        break;
      }

      default:
        console.log("[stripe-webhook] Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[stripe-webhook] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
