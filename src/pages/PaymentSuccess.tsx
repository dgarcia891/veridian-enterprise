import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  return (
    <>
      <Helmet>
        <title>Payment Successful | AI Agents 3000</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="container max-w-lg mx-auto px-4">
            <Card className="glass-card text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-primary" />
                </div>
                <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Thank you for choosing AI Agents 3000. Your plan is now active.
                </p>
                <p className="text-sm text-muted-foreground">
                  Next, let's set up your AI voice agent so it's ready to handle calls for your business.
                </p>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate("/onboarding" + (sessionId ? `?session_id=${sessionId}` : ""))}
                >
                  Set Up Your AI Agent
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PaymentSuccess;
