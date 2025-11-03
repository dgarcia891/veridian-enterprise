import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AIInsightGenerator } from "@/components/AIInsightGenerator";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AIInsightReport() {
  const [isPaid, setIsPaid] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, []);

  async function verifyPayment(sessionId: string) {
    setVerifying(true);
    
    const n8nBaseUrl = import.meta.env.VITE_N8N_WEBHOOK_BASE_URL;
    if (!n8nBaseUrl) {
      console.error("N8N webhook URL not configured");
      toast.error("Payment verification unavailable. Please contact support.");
      setVerifying(false);
      return;
    }

    try {
      const response = await fetch(`${n8nBaseUrl}/webhook/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      const data = await response.json();
      
      if (data.status === "paid") {
        setIsPaid(true);
        toast.success("Payment verified! Full report unlocked.");
        
        // Clean up URL
        window.history.replaceState({}, document.title, "/ai-insight");
      } else {
        toast.error("Payment not confirmed. Please contact support if you completed payment.");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error("Could not verify payment. Please contact support.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleCheckout() {
    const n8nBaseUrl = import.meta.env.VITE_N8N_WEBHOOK_BASE_URL;
    if (!n8nBaseUrl) {
      toast.error("Payment system not configured. Please contact support.");
      return;
    }

    try {
      const response = await fetch(`${n8nBaseUrl}/webhook/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product: "ai_report" }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      
      if (data.sessionId) {
        // Redirect to Stripe checkout
        window.location.href = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
      } else {
        throw new Error("No session ID returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Unable to start checkout. Please try again or contact support.");
    }
  }

  return (
    <>
      <Helmet>
        <title>Free AI Business Growth Report | AI Agents 3000</title>
        <meta
          name="description"
          content="Get a personalized AI opportunity report for your business. Discover how AI can boost revenue, reduce costs, and automate operations."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16">
            {verifying ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">Verifying your payment...</p>
              </div>
            ) : (
              <AIInsightGenerator
                paywallMode={true}
                isPaid={isPaid}
                onUpgradeClick={handleCheckout}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
