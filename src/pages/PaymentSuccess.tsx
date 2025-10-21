import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    document.title = "Payment Successful - Veridian Enterprise";
  }, []);

  const handleScheduleAppointment = () => {
    // Open Cal.com in new tab
    window.open("https://cal.com/your-calendar", "_blank");
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Thank you for choosing Veridian Enterprise's Voice AI Receptionist
          </p>

          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>Let's get your AI receptionist set up</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-accent">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Schedule Your Setup Appointment</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Book a 30-minute call with our team to configure your AI receptionist
                  </p>
                  <Button onClick={handleScheduleAppointment} className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Now
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg border">
                <div className="shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Check Your Email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent you a confirmation email with your payment receipt and account details
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg border">
                <div className="shrink-0 w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Setup & Go Live</h3>
                  <p className="text-sm text-muted-foreground">
                    After your setup call, your AI receptionist will be live and answering calls 24/7
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Return to Home
            </Button>
            <Button onClick={handleScheduleAppointment} className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Setup Call
            </Button>
          </div>

          {sessionId && (
            <p className="text-xs text-muted-foreground mt-8">
              Transaction ID: {sessionId}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentSuccess;