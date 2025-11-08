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
      throw new Error("Webhook configuration error");
    }

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
      console.error("Webhook signature verification failed");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const signupId = session.metadata?.signup_id;
        
        if (!signupId) {
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
          throw updateError;
        }
        break;
      }

      case "payment_intent.succeeded": {
        // Payment successful
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update the payment status to failed
        const { error: failError } = await supabaseClient
          .from("customer_signups")
          .update({ payment_status: "failed" })
          .eq("stripe_payment_intent_id", paymentIntent.id);
        
        if (failError) {
          console.error("Failed to update payment status");
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update the subscription status
        const { error: cancelError } = await supabaseClient
          .from("customer_signups")
          .update({ payment_status: "cancelled" })
          .eq("stripe_subscription_id", subscription.id);
        
        if (cancelError) {
          console.error("Failed to update subscription status");
        }
        break;
      }

      default:
        // Unhandled event type
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook processing error");
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
