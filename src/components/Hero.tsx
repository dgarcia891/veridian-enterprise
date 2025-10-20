import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";

const Hero = () => {
  const openRetellChat = () => {
    if (window.RetellWebClient) {
      window.RetellWebClient.open();
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center" aria-label="Hero section">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 animate-gradient">
          <div 
            className="absolute inset-0 opacity-30" 
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      </div>

      <div className="px-6 max-w-6xl mx-auto w-full">
        <div className="md:max-w-3xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight animate-fade-in">
            Never miss{" "}
            <span className="font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              another customer call
            </span>{" "}
            with Voice AI
          </h1>
          
          <p className="text-white/70 mt-8 text-lg md:text-xl max-w-2xl animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
            Our intelligent Voice AI receptionist answers every call 24/7, handles complex orders, qualifies leads, and integrates seamlessly with your business - turning missed calls into captured revenue.
          </p>
          
          <div className="mt-12 flex flex-wrap gap-4 animate-fade-in [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
            <Button 
              onClick={openRetellChat} 
              className="bg-white text-black rounded-full px-8 py-3 text-sm font-medium hover:bg-white/90 transition-all duration-300 flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Schedule free demo - open Retell chat"
            >
              Schedule Free Demo
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
            </Button>
            <Button 
              onClick={openRetellChat} 
              className="bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full px-8 py-3 text-sm font-medium hover:bg-white/30 hover:border-white/40 transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Calculate your lost revenue - open Retell chat"
            >
              <MessageSquare size={16} aria-hidden="true" />
              Calculate Lost Revenue
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 text-white animate-fade-in [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]" role="region" aria-label="Key statistics">
            <div className="group">
              <p className="text-3xl md:text-4xl font-light group-hover:scale-110 transition-transform duration-300" aria-label="Zero percent">0%</p>
              <p className="text-white/50 text-sm mt-2">Missed Calls</p>
            </div>
            <div className="group">
              <p className="text-3xl md:text-4xl font-light group-hover:scale-110 transition-transform duration-300" aria-label="Twenty-four seven">24/7</p>
              <p className="text-white/50 text-sm mt-2">Availability</p>
            </div>
            <div className="group">
              <p className="text-3xl md:text-4xl font-light group-hover:scale-110 transition-transform duration-300" aria-label="Ten minutes">10min</p>
              <p className="text-white/50 text-sm mt-2">Setup Time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
