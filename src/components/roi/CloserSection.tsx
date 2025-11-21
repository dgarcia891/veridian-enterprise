import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useROI } from "@/contexts/ROIContext";
import { formatCurrency } from "@/hooks/useROICalculation";

interface CloserSectionProps {
  isMediumBusiness: boolean;
}

const CloserSection = ({ isMediumBusiness }: CloserSectionProps) => {
  const navigate = useNavigate();
  const { annualLoss: annualLossValue } = useROI();
  const annualLoss = formatCurrency(annualLossValue);

  const handleCTAClick = () => {
    console.log('[Analytics] CTA Click: Final Closer', { 
      location: 'closer-section', 
      timestamp: new Date().toISOString() 
    });
    navigate("/signup");
  };

  const finalValueProps = [
    {
      icon: CheckCircle,
      text: "100% Call Capture - Never Lose Another Lead",
    },
    {
      icon: Clock,
      text: "Instant Response - Convert 7x More Leads",
    },
    {
      icon: Shield,
      text: "24/7 Availability - Work Freely While AI Handles Calls",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-4 sm:p-8 md:p-12 text-center">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-foreground">
            Can You Afford to <strong>Miss Another Call?</strong>
          </h2>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-3">
            Stop losing <strong>
              <a 
                href="#calculator"
                className="text-destructive hover:underline cursor-pointer transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              >
                {annualLoss} a year
              </a>
            </strong>.
          </p>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12">
            Start converting <strong>100% of your calls</strong>.
          </p>

          {/* Value Props Recap */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {finalValueProps.map((prop, index) => {
              const Icon = prop.icon;
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl bg-background/50 border border-border hover:border-primary transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground text-center">
                    {prop.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="mb-8">
            <Button 
              onClick={handleCTAClick}
              size="default"
              className="bg-primary text-primary-foreground rounded-full px-6 sm:px-10 md:px-12 py-4 sm:py-6 md:py-7 text-base sm:text-lg md:text-xl font-bold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 mx-auto group shadow-lg w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Book My Free AI Audit</span>
              <span className="sm:hidden">Book Free Audit</span>
              <ArrowRight size={20} className="sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0" aria-hidden="true" />
            </Button>
          </div>

          {/* FUD Reduction */}
          <div className="space-y-3 pt-6 border-t border-border">
            <p className="text-base text-muted-foreground">
              <strong className="text-foreground">No Risk.</strong> 60-Day Money Back Guarantee.
            </p>
            
            <p className="text-base text-muted-foreground">
              <strong className="text-foreground">No Contract.</strong> Cancel anytime.
            </p>
            
            <p className="text-base text-muted-foreground">
              <strong className="text-foreground">No Complex Setup.</strong> Live in 24 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CloserSection;
