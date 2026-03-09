import { lazy, Suspense } from "react";
import PASSection from "@/components/roi/PASSection";
import SolutionSection from "@/components/roi/SolutionSection";
import TryItNowDemo from "@/components/TryItNowDemo";
import CloserSection from "@/components/roi/CloserSection";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/SkipToContent";
import { Helmet } from "react-helmet";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { ROIProvider } from "@/contexts/ROIContext";
import { Skeleton } from "@/components/ui/skeleton";
import NewsletterSignup from "@/components/NewsletterSignup";

const ProblemStatsSection = lazy(() => import("@/components/roi/ProblemStatsSection"));
const InteractiveCalculator = lazy(() => import("@/components/roi/InteractiveCalculator"));
const GrowthSection = lazy(() => import("@/components/roi/GrowthSection"));
const CaseStudySection = lazy(() => import("@/components/roi/CaseStudySection"));

const SectionSkeleton = () => (
  <div className="py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto space-y-4">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-48 w-full mt-6" />
    </div>
  </div>
);

const Index = () => {
  const [isMediumBusiness, setIsMediumBusiness] = useState(false);

  return (
    <ROIProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Helmet>
          <title>AI Receptionist ROI Calculator | Stop Losing $126k/Year</title>
          <meta
            name="description"
            content="Calculate how much revenue your business loses from missed calls. See the real ROI of 24/7 AI receptionists vs human staff. Free interactive calculator."
          />
          <link rel="canonical" href="https://aiagents3000.com/" />

          {/* Structured Data for Search Engines */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AI Receptionist ROI Calculator",
              "description": "Calculate how much revenue your business loses from missed calls. Interactive ROI calculator for AI receptionist services.",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "24/7 Call Answering",
                "100% Call Answer Rate",
                "Instant Response Time",
                "Lead Capture",
                "Appointment Booking"
              ]
            })}
          </script>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much revenue do businesses lose from missed calls?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Small and medium businesses lose an average of $126,000 annually from unanswered calls. 85% of customers who get voicemail won't call back, and 62% will immediately contact a competitor."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is an AI receptionist?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "An AI receptionist is a 24/7/365 virtual employee that answers 100% of your calls, captures leads, takes orders, and books appointments instantly with response times under 1 second."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the ROI calculator work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our calculator estimates revenue loss based on your missed calls per day and average customer value. It factors in that 85% of callers don't call back when they reach voicemail."
                  }
                }
              ]
            })}
          </script>
        </Helmet>

        <SkipToContent />

        <Navigation />

        <main id="main-content">
          <Suspense fallback={<SectionSkeleton />}>
            <ProblemStatsSection
              isMediumBusiness={isMediumBusiness}
              setIsMediumBusiness={setIsMediumBusiness}
            />
          </Suspense>
          <PASSection isMediumBusiness={isMediumBusiness} />
          <SolutionSection />
          <Suspense fallback={<SectionSkeleton />}>
            <InteractiveCalculator isMediumBusiness={isMediumBusiness} />
          </Suspense>
          <TryItNowDemo />
          <Suspense fallback={<SectionSkeleton />}>
            <GrowthSection />
          </Suspense>
          <Suspense fallback={<SectionSkeleton />}>
            <CaseStudySection />
          </Suspense>
          <CloserSection isMediumBusiness={isMediumBusiness} />

          <NewsletterSignup variant="banner" />

          <section className="py-8 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
            <div className="max-w-4xl mx-auto text-center">
              <a
                href="/faq"
                className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:underline transition-all group"
              >
                <strong>Questions? Visit Our FAQ</strong>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ROIProvider>
  );
};

export default Index;
