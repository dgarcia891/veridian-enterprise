import ROINavigation from "@/components/roi/ROINavigation";
import ProblemStatsSection from "@/components/roi/ProblemStatsSection";
import SolutionSection from "@/components/roi/SolutionSection";
import InteractiveCalculator from "@/components/roi/InteractiveCalculator";
import GrowthSection from "@/components/roi/GrowthSection";
import ServiceCTA from "@/components/ServiceCTA";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { ArrowRight } from "lucide-react";

const ROICalculator = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>AI Receptionist ROI Calculator | Stop Losing $126k/Year</title>
        <meta 
          name="description" 
          content="Calculate how much revenue your business loses from missed calls. See the real ROI of 24/7 AI receptionists vs human staff. Free interactive calculator." 
        />
      </Helmet>

      <a 
        href="#problem" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      
      <ROINavigation />
      
      <main>
        <ProblemStatsSection />
        <SolutionSection />
        <InteractiveCalculator />
        <GrowthSection />
        
        <ServiceCTA 
          headline="Can you afford to miss another call?"
          description="Stop losing $126,000 a year. Start converting 100% of your calls."
          buttonText="Get Started Today"
        />
        
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <a 
              href="/faq"
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline transition-all group"
            >
              Want to Know More About AI Agents?
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              Explore our comprehensive FAQ covering capabilities, integrations, and more
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ROICalculator;
