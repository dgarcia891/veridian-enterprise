import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CALCOM_CONFIG, CALCOM_THEME } from "@/config/calcom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCalFallback } from "@/hooks/useCalFallback";

const Consultation = () => {
  const navigate = useNavigate();
  const { showFallback, onCalLoaded } = useCalFallback();
  const {
    trackCalendarLoaded,
    trackBookingCompleted,
    trackConsultationBooked
  } = useAnalytics();

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: CALCOM_THEME.theme,
        hideEventTypeDetails: CALCOM_THEME.hideEventTypeDetails,
        layout: CALCOM_THEME.layout,
      });

      // Track calendar loaded (FR-005)
      cal("on", {
        action: "linkReady",
        callback: () => {
          trackCalendarLoaded("consultation_page");
          onCalLoaded();
        },
      });

      // Track successful bookings and redirect to confirmation
      cal("on", {
        action: "bookingSuccessful",
        callback: (e) => {
          const eventData = e.detail?.data as Record<string, unknown> | undefined;
          const booking = eventData?.booking as Record<string, unknown> | undefined;
          trackBookingCompleted(
            String(booking?.uid || ""),
            String(booking?.email || "")
          );
          trackConsultationBooked("consultation_page");
          navigate("/consultation-booked");
        },
      });
    })();
  }, [navigate, trackCalendarLoaded, trackBookingCompleted, trackConsultationBooked, onCalLoaded]);

  return (
    <>
      <Helmet>
        <title>Schedule Consultation - AI Agents 3000</title>
        <meta
          name="description"
          content="Schedule a free consultation to discuss how AI automation can transform your business."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />

        <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Schedule Your Consultation
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Book a time to discuss how AI Agents 3000 can help your business never miss another call.
              </p>
            </div>

            <div className="bg-card rounded-2xl shadow-lg p-6 min-h-[700px]">
              {showFallback && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4 text-center">
                  <p className="font-semibold">Having trouble loading the calendar?</p>
                  <p className="text-sm">Please call us directly at <a href="tel:661-263-4388" className="underline font-bold">661-263-4388</a> or try refreshing the page.</p>
                </div>
              )}
              <Cal
                calLink={CALCOM_CONFIG.bookingLink}
                style={{ width: "100%", height: "100%", minHeight: "650px" }}
                config={{
                  theme: CALCOM_THEME.theme,
                  layout: CALCOM_THEME.layout,
                }}
              />
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-foreground">What We'll Cover</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Your current call handling process and pain points</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>How an AI receptionist would work specifically for your business</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Live demo of AI handling customer calls in your industry</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Estimated revenue recovery and ROI for your business</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span>Implementation timeline and next steps</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Why This Call Matters</h2>
                <p className="text-muted-foreground mb-4">
                  This isn't a sales pitch. It's a strategy session focused on understanding your unique business challenges and showing you exactly how AI automation can help.
                </p>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">15 min</span>
                    <span>Quick, focused conversation - no fluff</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">$0</span>
                    <span>Completely free, no obligation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-bold">Real demos</span>
                    <span>See actual AI conversations, not just theory</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Consultation;
