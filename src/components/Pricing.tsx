
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Monthly Plan",
      price: "500",
      description: "Standard month-to-month service with no long-term commitment",
      features: [
        "Fully operational AI receptionist",
        "24/7 call answering",
        "Complex order handling",
        "Lead qualification",
        "Appointment booking",
        "API integration support",
        "Real-time status updates",
        "Setup fee: $450"
      ],
      popular: false
    },
    {
      name: "Annual Plan", 
      price: "208",
      description: "Best value - prepay for the year and save significantly",
      features: [
        "Everything in Monthly Plan",
        "Save over 50% per month",
        "FREE setup (worth $450)",
        "Priority support",
        "Option for second agent",
        "Advanced customization",
        "Quarterly strategy reviews",
        "Total: $2,500/year"
      ],
      popular: true
    }
  ];

  return (
    <section id="pricing" className="py-32 px-6" aria-labelledby="pricing-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 id="pricing-heading" className="text-4xl md:text-5xl font-light text-white mb-6">
            Simple <span className="font-semibold">Pricing</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. If you miss just 10 calls per day at $75 average order value, you're losing $5,250/week. Our service is a fraction of what we help you recover.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto" role="list" aria-label="Pricing plans">
          {plans.map((plan, index) => (
            <article
              key={index}
              className={`glass-card rounded-2xl p-8 relative hover:bg-white/10 transition-all duration-500 group ${
                plan.popular ? 'ring-2 ring-white/30' : ''
              }`}
              role="listitem"
              aria-labelledby={`plan-${index}-name`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium" role="status">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 id={`plan-${index}-name`} className="text-2xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-white/70 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-light text-white" aria-label={`${plan.price} dollars per month`}>${plan.price}</span>
                  <span className="text-white/60" aria-hidden="true">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8" aria-label={`${plan.name} plan features`}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-white/80">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-full py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${
                  plan.popular
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'glass-button text-white hover:bg-white/20'
                }`}
                aria-label={`Get started with ${plan.name}`}
              >
                Get Started
              </Button>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/60 text-sm">
            Month-to-month commitment • Cancel anytime • Live demo included
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
