import { industries } from "@/data/industries";

interface IndustriesServedProps {
  title?: string;
  subtitle?: string;
}

const IndustriesServed = ({ 
  title = "Who We Help",
  subtitle = "Voice AI Receptionist works for any service-based business"
}: IndustriesServedProps) => {
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <div
                key={industry.id}
                className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-default animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="w-12 h-12 text-primary mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-semibold mb-2">{industry.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {industry.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustriesServed;
