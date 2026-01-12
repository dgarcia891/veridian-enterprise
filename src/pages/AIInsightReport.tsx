import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { AIInsightGenerator } from "@/components/AIInsightGenerator";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

    try {
      const { data, error } = await supabase.functions.invoke("verify-ai-report-payment", {
        body: { session_id: sessionId },
      });

      if (error) {
        throw error;
      }

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
    try {
      const { data, error } = await supabase.functions.invoke("create-ai-report-payment");

      if (error) {
        throw error;
      }

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
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
