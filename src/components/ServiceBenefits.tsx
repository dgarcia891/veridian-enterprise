import { Benefit } from "@/data/services";

interface ServiceBenefitsProps {
  benefits: Benefit[];
  title?: string;
  subtitle?: string;
}

const ServiceBenefits = ({ 
  benefits,
  title = "Why Choose Voice AI?",
  subtitle = "Proven results that drive business growth"
}: ServiceBenefitsProps) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="text-center p-8 glass-card rounded-2xl animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Icon className="w-12 h-12 text-primary mx-auto mb-4" aria-hidden="true" />
                <div className="text-5xl font-bold mb-3 text-primary">
                  {benefit.stat}
                </div>
                <p className="text-muted-foreground text-lg">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceBenefits;
