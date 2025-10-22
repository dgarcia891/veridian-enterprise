import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ServiceCTAProps {
  headline: string;
  description: string;
  buttonText?: string;
}

const ServiceCTA = ({ 
  headline, 
  description, 
  buttonText = "Get Started Now" 
}: ServiceCTAProps) => {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    console.log('[Analytics] CTA Click: Get Started', { 
      location: 'service-cta', 
      buttonText,
      timestamp: new Date().toISOString() 
    });
    navigate("/signup");
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-card">
      <div className="max-w-4xl mx-auto text-center glass-card p-12 rounded-3xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          {headline}
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        <Button 
          onClick={handleCTAClick}
          size="lg"
          className="bg-primary text-primary-foreground rounded-full px-10 py-6 text-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 mx-auto group"
        >
          {buttonText}
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
};

export default ServiceCTA;
