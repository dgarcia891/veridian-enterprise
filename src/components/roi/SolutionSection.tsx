import { Clock, CheckCircle, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const highlights = [
  {
    value: "100%",
    title: "Call Answer Rate",
    description: "Never miss a lead again, even at 3 AM or on a holiday.",
    icon: CheckCircle,
  },
  {
    value: "<1 sec",
    title: "Response Time",
    description: "Customers get instant answers, not a ringing phone or hold music.",
    icon: Clock,
  },
  {
    value: "24/7",
    title: "Availability",
    description: "Capture leads while you eat, sleep, and focus on your work.",
    icon: Calendar,
  },
];

const SolutionSection = () => {
  const navigate = useNavigate();
  
  return (
    <section id="solution" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center">
          The Solution: A 24/7 AI Agent
        </h2>
        <p className="text-xl opacity-90 mb-12 text-center max-w-3xl mx-auto">
          An AI agent isn't just a voicemail. It's a 24/7/365 employee that answers 100% of your calls, captures leads, takes orders, and books appointments—instantly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div key={index} className="text-center p-6">
                <Icon className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <div className="text-5xl font-extrabold mb-2">
                  {highlight.value}
                </div>
                <div className="text-lg font-semibold mb-2 opacity-90">
                  {highlight.title}
                </div>
                <p className="text-sm opacity-80">
                  {highlight.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Button 
            onClick={() => navigate("/signup")}
            size="lg"
            className="rounded-full px-10 py-6 text-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 mx-auto group bg-primary-foreground text-primary"
          >
            Get 100% Lead Capture Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
          </Button>
          <p className="text-sm opacity-80 mt-3">
            No complex setup required • 60-Day Money Back Guarantee
          </p>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
