import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import Cal, { getCalApi } from "@calcom/embed-react";
import { CALCOM_CONFIG, CALCOM_THEME } from "@/config/calcom";

const ScheduleConsultation = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: CALCOM_THEME.theme,
        hideEventTypeDetails: CALCOM_THEME.hideEventTypeDetails,
        layout: CALCOM_THEME.layout,
      });
    })();
  }, []);

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
