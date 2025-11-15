import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PASSectionProps {
  isMediumBusiness: boolean;
}

const PASSection = ({ isMediumBusiness }: PASSectionProps) => {
  const navigate = useNavigate();
  const annualLoss = isMediumBusiness ? "$126,000" : "$17,000";

  const handleCTAClick = () => {
    console.log('[Analytics] CTA Click: Get Started', { 
      location: 'pas-section', 
      timestamp: new Date().toISOString() 
    });
    navigate("/signup");
  };

  return (
    <section id="pas" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16 bg-gradient-to-br from-destructive/5 to-background">
      <div className="max-w-4xl mx-auto">
        {/* Pain Point Headline */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-6">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold text-sm uppercase tracking-wide">Stop The Revenue Bleed</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-foreground">
            Here's the <strong>ONLY way</strong> to convert <strong>100% of callers</strong> instantly.
          </h2>
        </div>

        {/* PAS Body Copy */}
        <div className="glass-card p-8 sm:p-12 rounded-3xl space-y-6">
          {/* PAIN */}
          <div className="space-y-4">
            <p className="text-lg sm:text-xl text-foreground">
              Dear Business Owner,
            </p>
            
            <p className="text-lg sm:text-xl text-foreground">
              <strong>Are you losing customers to voicemail?</strong>
            </p>
            
            <p className="text-lg sm:text-xl text-muted-foreground">
              Every missed call is a customer choosing your competitor.
            </p>
          </div>

          {/* AGITATE */}
          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-lg sm:text-xl text-muted-foreground">
              Think about it: <strong>
                <a 
                  href="#calculator"
                  className="text-destructive hover:underline cursor-pointer transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  {annualLoss} lost every year
                </a>
              </strong>.
            </p>
            
            <p className="text-lg sm:text-xl text-muted-foreground">
              That's real money walking out the door.
            </p>
            
            <p className="text-lg sm:text-xl text-muted-foreground">
              <strong>85% of callers won't call back.</strong> They hang up and move on.
            </p>
            
            <p className="text-lg sm:text-xl text-muted-foreground">
              <strong>62% go straight to a competitor.</strong>
            </p>
            
            <p className="text-lg sm:text-xl text-foreground font-semibold">
              Your missed call is their new customer.
            </p>
          </div>

          {/* SOLVE */}
          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-lg sm:text-xl text-foreground">
              <strong>There's a better way.</strong>
            </p>
            
            <p className="text-lg sm:text-xl text-muted-foreground">
              A 24/7 AI Agent answers <strong>every single call</strong>.
            </p>
            
            <p className="text-lg sm:text-xl text-muted-foreground">
              No more voicemail. No more lost leads.
            </p>
            
            <p className="text-lg sm:text-xl text-foreground font-semibold">
              <strong>100% call capture. Guaranteed.</strong>
            </p>
          </div>

          {/* CTA */}
          <div className="pt-8 text-center">
            <Button 
              onClick={handleCTAClick}
              size="lg"
              className="bg-primary text-primary-foreground rounded-full px-10 py-6 text-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 mx-auto group"
            >
              Get 100% Lead Capture Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Replaces $50,000 Human Receptionist WITHOUT High Salaries or Training Costs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PASSection;
