
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
            Transform your{" "}
            <span className="font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              social presence
            </span>{" "}
            into revenue
          </h1>
          
          <p className="text-white/70 mt-8 text-lg md:text-xl max-w-2xl animate-fade-in [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
            VEridian specializes in data-driven social media marketing that converts followers into customers. 
            Amplify your brand's voice across all platforms with our proven strategies.
          </p>
          
          <div className="mt-12 flex flex-wrap gap-4 animate-fade-in [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
            <Button className="bg-white text-black rounded-full px-8 py-3 text-sm font-medium hover:bg-white/90 transition-all duration-300 flex items-center gap-2 group">
              Start Growing Today
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button className="glass-button text-white rounded-full px-8 py-3 text-sm font-medium flex items-center gap-2">
              <Play size={16} />
              View Case Studies
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 text-white animate-fade-in [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards]">
            <div className="group">
              <p className="text-3xl md:text-4xl font-light group-hover:scale-110 transition-transform duration-300">500+</p>
              <p className="text-white/50 text-sm mt-2">Brands Grown</p>
            </div>
            <div className="group">
              <p className="text-3xl md:text-4xl font-light group-hover:scale-110 transition-transform duration-300">250%</p>
              <p className="text-white/50 text-sm mt-2">Avg ROI Increase</p>
            </div>
            <div className="group">
              <p className="text-3xl md:text-4xl font-light group-hover:scale-110 transition-transform duration-300">50M+</p>
              <p className="text-white/50 text-sm mt-2">Impressions Monthly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
