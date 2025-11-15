import ProblemStatsSection from "@/components/roi/ProblemStatsSection";
import PASSection from "@/components/roi/PASSection";
import SolutionSection from "@/components/roi/SolutionSection";
import InteractiveCalculator from "@/components/roi/InteractiveCalculator";
import GrowthSection from "@/components/roi/GrowthSection";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [isMediumBusiness, setIsMediumBusiness] = useState(false);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>AI Receptionist ROI Calculator | Stop Losing $126k/Year</title>
        <meta 
          name="description" 
          content="Calculate how much revenue your business loses from missed calls. See the real ROI of 24/7 AI receptionists vs human staff. Free interactive calculator." 
        />
        <link rel="canonical" href="https://veridian.lovable.app/" />
        
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

      <a 
        href="#problem" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      
      <header className="bg-background/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate("/")}
              className="flex-shrink-0 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
            >
              The AI Agent ROI
            </button>
            <Button 
              onClick={() => navigate("/signup")}
              size="lg"
            >
              Get 100% Lead Capture Now
            </Button>
          </div>
        </nav>
      </header>
      
      <main>
        <ProblemStatsSection 
          isMediumBusiness={isMediumBusiness}
          setIsMediumBusiness={setIsMediumBusiness}
        />
        <PASSection />
        <SolutionSection />
        <InteractiveCalculator isMediumBusiness={isMediumBusiness} />
        <GrowthSection />
        
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <a 
              href="/faq"
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline transition-all group"
            >
              <strong>Want to Know More About AI Agents?</strong>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              Explore our FAQ covering capabilities and integrations.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
