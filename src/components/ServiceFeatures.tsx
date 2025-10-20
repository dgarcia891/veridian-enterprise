import { Feature } from "@/data/services";
import { useRef } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface ServiceFeaturesProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
}

const ServiceFeatures = ({ 
  features, 
  title = "Intelligent Voice AI Features",
  subtitle = "Everything you need to capture every revenue opportunity"
}: ServiceFeaturesProps) => {
  const ref = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(ref);

  return (
    <section 
      id="features" 
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {isVisible && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6">
                    <Icon className="w-12 h-12 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceFeatures;
