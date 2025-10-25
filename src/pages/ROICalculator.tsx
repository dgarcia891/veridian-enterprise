import ROINavigation from "@/components/roi/ROINavigation";
import ProblemStatsSection from "@/components/roi/ProblemStatsSection";
import SolutionSection from "@/components/roi/SolutionSection";
import InteractiveCalculator from "@/components/roi/InteractiveCalculator";
import GrowthSection from "@/components/roi/GrowthSection";
import ServiceCTA from "@/components/ServiceCTA";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";

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
      </main>
      
      <Footer />
    </div>
  );
};

export default ROICalculator;
