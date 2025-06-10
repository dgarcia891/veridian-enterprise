
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Iframe */}
      <div className="fixed inset-0 z-[-1]">
        <iframe 
          src="https://my.spline.design/glassmorphlandingpage-nyOS3MRrg0GCft1x8mCtqPwk/" 
          width="100%" 
          height="100%" 
          frameBorder="0"
          className="w-full h-full"
        />
      </div>

      <div className="px-6 max-w-6xl mx-auto w-full">
        <div className="md:max-w-3xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight animate-fade-in">
            All-in-one{" "}
            <span className="font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              marketing automation
            </span>{" "}
            for your business
          </h1>
          
          <p className="text-white/70 mt-8 text-lg md:text-xl max-w-2xl animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
            VEridian delivers complete marketing solutions - from lead generation and CRM to automated follow-ups and social media management, all powered by our advanced platform technology.
          </p>
          
          <div className="mt-12 flex flex-wrap gap-4 animate-fade-in [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
            <Button className="bg-white text-black rounded-full px-8 py-3 text-sm font-medium hover:bg-white/90 transition-all duration-300 flex items-center gap-2 group">
              Start Your Free Trial
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button className="glass-button text-white rounded-full px-8 py-3 text-sm font-medium flex items-center gap-2">
              <Play size={16} />
              See Platform Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 text-white animate-fade-in [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
            <div className="group">
              <p className="text-3xl md:text-4xl font-light group-hover:scale-110 transition-transform duration-300">97%</p>
              <p className="text-white/50 text-sm mt-2">Client Retention</p>
            </div>
            <div className="group">
              <p className="text-3xl md:text-4xl font-light group-hover:scale-110 transition-transform duration-300">3x</p>
              <p className="text-white/50 text-sm mt-2">Lead Conversion</p>
            </div>
            <div className="group">
              <p className="text-3xl md:text-4xl font-light group-hover:scale-110 transition-transform duration-300">24/7</p>
              <p className="text-white/50 text-sm mt-2">Automation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
