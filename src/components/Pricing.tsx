
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "2,500",
      description: "Perfect for small businesses starting their social journey",
      features: [
        "2 social platforms",
        "15 posts per month",
        "Basic analytics",
        "Community management",
        "Monthly strategy session"
      ],
      popular: false
    },
    {
      name: "Growth",
      price: "5,000",
      description: "Ideal for businesses ready to scale their presence",
      features: [
        "4 social platforms",
        "30 posts per month",
        "Advanced analytics",
        "Paid ad management",
        "Bi-weekly strategy calls",
        "Content calendar",
        "Influencer outreach"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "10,000",
      description: "For brands demanding exceptional results",
      features: [
        "All social platforms",
        "Unlimited content",
        "Custom reporting",
        "Dedicated account team",
        "Weekly strategy sessions",
        "Crisis management",
        "Brand reputation monitoring"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Investment <span className="font-semibold">Plans</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Choose the perfect plan to accelerate your social media growth. All plans include strategy development and performance optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass-card rounded-2xl p-8 relative hover:bg-white/10 transition-all duration-500 group ${
                plan.popular ? 'ring-2 ring-white/30' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-white mb-2">{plan.name}</h3>
                <p className="text-white/70 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-light text-white">${plan.price}</span>
                  <span className="text-white/60">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-white/80">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full rounded-full py-3 font-medium transition-all duration-300 ${
                  plan.popular
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'glass-button text-white hover:bg-white/20'
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
