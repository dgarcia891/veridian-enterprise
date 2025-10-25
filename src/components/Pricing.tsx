import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PricingPlan } from "@/data/services";
import { useRetellWidget } from "@/hooks/useRetellWidget";

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  subtitle?: string;
}

const Pricing = ({ 
  plans,
  title = "Simple, Transparent Pricing",
  subtitle = "One recovered call pays for months of service"
}: PricingProps) => {
  const { isWidgetReady, openChat } = useRetellWidget();

  const handlePlanClick = (planName: string) => {
    console.log('[Analytics] Plan Select:', { 
      plan: planName, 
      location: 'pricing', 
      timestamp: new Date().toISOString() 
    });
    openChat();
  };

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`glass-card p-8 sm:p-10 rounded-3xl relative hover:scale-105 transition-all duration-300 animate-fade-in ${
                plan.popular ? 'border-2 border-primary' : ''
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handlePlanClick(plan.name)}
                disabled={!isWidgetReady}
                className={`w-full rounded-full py-6 text-base font-semibold transition-all duration-200 ${
                  plan.popular 
                    ? 'bg-primary text-primary-foreground hover:scale-105' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                aria-label={`${plan.ctaText} - open chat to get started`}
              >
                {plan.ctaText}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            HIPAA compliance available with Medical/Healthcare plan - includes Business Associate Agreement (BAA) and enhanced security protocols
          </p>
          <p className="text-muted-foreground">
            All plans include unlimited call handling, 24/7 availability, and no setup fees
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
