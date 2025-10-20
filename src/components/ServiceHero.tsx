import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useRetellWidget } from "@/hooks/useRetellWidget";

interface ServiceHeroProps {
  title: string;
  subtitle: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  showStats?: boolean;
}

const ServiceHero = ({
  title,
  subtitle,
  primaryCtaText = "Schedule Free Demo",
  secondaryCtaText = "Calculate Lost Revenue",
  showStats = true
}: ServiceHeroProps) => {
  const { isWidgetReady, openChat } = useRetellWidget();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 animate-gradient overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in leading-tight">
          {title}
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 mb-8 max-w-3xl mx-auto animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards] leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row flex-wrap gap-4 justify-center animate-fade-in [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
          <Button 
            onClick={openChat} 
            disabled={!isWidgetReady}
            size="lg"
            className="bg-primary text-primary-foreground rounded-full px-8 py-6 text-base font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label={`${primaryCtaText} - open chat`}
          >
            {primaryCtaText}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
          </Button>
          
          <Link to="/lost-revenue-calculator">
            <Button 
              size="lg"
              variant="outline"
              className="glass-button rounded-full px-8 py-6 text-base font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
              aria-label={secondaryCtaText}
            >
              <MessageSquare size={18} aria-hidden="true" />
              {secondaryCtaText}
            </Button>
          </Link>
        </div>

        {showStats && (
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fade-in [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-3xl sm:text-4xl font-bold mb-2">37%</div>
              <div className="text-sm sm:text-base text-foreground/80">Average Missed Calls</div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm sm:text-base text-foreground/80">Availability</div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <div className="text-3xl sm:text-4xl font-bold mb-2">10 min</div>
              <div className="text-sm sm:text-base text-foreground/80">Setup Time</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceHero;
