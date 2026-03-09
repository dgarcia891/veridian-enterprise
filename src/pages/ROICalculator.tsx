import QuickStatsBar from "@/components/roi/QuickStatsBar";
import EnhancedCalculator from "@/components/roi/EnhancedCalculator";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import { Helmet } from "react-helmet";
import { ArrowRight } from "lucide-react";

const ROICalculator = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>AI Receptionist ROI Calculator | Calculate Your Revenue Loss</title>
        <meta 
          name="description" 
          content="Calculate exactly how much revenue your business loses from missed calls. Free interactive calculator shows daily, monthly, and annual impact plus ROI comparison." 
        />
      </Helmet>

      <SkipToContent />
      
      <main id="main-content">
        <QuickStatsBar />
        <EnhancedCalculator />
        
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-card/50 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <a 
              href="/faq"
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline transition-all group"
            >
              Questions About AI Receptionists?
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              Visit our FAQ for detailed answers
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ROICalculator;
