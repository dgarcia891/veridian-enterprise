import { CheckCircle } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface HowItWorksProps {
  steps?: Step[];
  title?: string;
  subtitle?: string;
}

const defaultSteps: Step[] = [
  {
    number: 1,
    title: "Quick Setup",
    description: "Sign up and configure your AI receptionist in just 10 minutes. No technical expertise required."
  },
  {
    number: 2,
    title: "AI Learns Your Business",
    description: "Our AI adapts to your services, pricing, availability, and business processes automatically."
  },
  {
    number: 3,
    title: "Start Capturing Revenue",
    description: "Your AI receptionist starts answering calls immediately, qualifying leads, and booking appointments 24/7."
  }
];

const HowItWorks = ({ 
  steps = defaultSteps,
  title = "How It Works",
  subtitle = "Get started in three simple steps"
}: HowItWorksProps) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="glass-card p-8 rounded-2xl h-full hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6 mx-auto">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {step.description}
                </p>
                <div className="flex justify-center mt-6">
                  <CheckCircle className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
