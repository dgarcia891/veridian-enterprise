import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Cal, { getCalApi } from "@calcom/embed-react";
import { CALCOM_CONFIG, CALCOM_THEME } from "@/config/calcom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCalFallback } from "@/hooks/useCalFallback";

const ScheduleConsultation = () => {
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
          trackCalendarLoaded("schedule_consultation_page");
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
          trackConsultationBooked("schedule_consultation_page");
          navigate("/consultation-booked");
        },
      });
    })();
  }, [navigate, trackCalendarLoaded, trackBookingCompleted, trackConsultationBooked, onCalLoaded]);

  return (
    <>
      <Helmet>
        <title>Schedule Consultation - AI Agents 3000</title>
        <meta name="description" content="Schedule a consultation with AI Agents 3000 to discuss how our AI receptionist can transform your business communication." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
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
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ScheduleConsultation;
