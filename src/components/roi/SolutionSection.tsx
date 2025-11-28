import { Clock, CheckCircle, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const highlights = [
  {
    value: "100%",
    title: "Call Answer Rate",
    headline: "Never Lose Another Lead",
    benefit: "With 100% Call Capture That Protects Your Revenue",
    description: "Even at 3 AM or holidays. Your business never sleeps.",
    icon: CheckCircle,
  },
  {
    value: "<1 sec",
    title: "Response Time",
    headline: "Answer Every Customer Instantly",
    benefit: "With Sub-Second Response That Builds Trust",
    description: "No ringing phone. No hold music. Just answers.",
    icon: Clock,
  },
  {
    value: "24/7",
    title: "Availability",
    headline: "Work Freely",
    benefit: "With 24/7 Availability That Captures Leads While You Sleep",
    description: "Focus on your work. AI handles the calls.",
    icon: Calendar,
  },
];

const SolutionSection = () => {
  const navigate = useNavigate();
  
  return (
    <section id="solution" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center">
          The Solution: <strong>A 24/7 AI Agent</strong>
        </h2>
        
        <p className="text-xl opacity-90 mb-3 text-center max-w-3xl mx-auto">
          An AI agent isn't just a voicemail.
        </p>
        
        <p className="text-xl opacity-90 mb-12 text-center max-w-3xl mx-auto">
          It's a <strong>24/7/365 employee</strong> that answers 100% of your calls instantly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div key={index} className="text-center p-6">
                <Icon className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <div className="text-5xl font-extrabold mb-2">
                  <strong>{highlight.value}</strong>
                </div>
                <div className="text-lg font-semibold mb-2 opacity-90">
                  <strong>{highlight.title}</strong>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {highlight.headline}
                </h3>
                <p className="text-base opacity-90 mb-2">
                  {highlight.benefit}
                </p>
                <p className="text-sm opacity-80">
                  {highlight.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* CTA Button */}
        <div className="mt-8 text-center">
          <Button 
            onClick={() => navigate("/schedule-consultation")}
            size="default"
            className="rounded-full px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 mx-auto group bg-primary-foreground text-primary w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Calculate My Lost Revenue</span>
            <span className="sm:hidden">Calculate Now</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0" aria-hidden="true" />
          </Button>
          <p className="text-sm opacity-80 mt-3">
            See exactly how much you're losing • Free calculator
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
