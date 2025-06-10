
import { Zap, Shield, Globe, Cpu, Palette, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with our optimized architecture and cutting-edge technology."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure by Design",
      description: "Enterprise-grade security with end-to-end encryption and advanced threat protection."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Scale",
      description: "Deploy worldwide with our distributed infrastructure and edge computing capabilities."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "AI-Powered",
      description: "Leverage artificial intelligence to automate workflows and enhance user experiences."
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Customizable",
      description: "Tailor every aspect to your needs with our flexible and extensible platform."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team using real-time collaboration and sharing features."
    }
  ];

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Powerful <span className="font-semibold">Features</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Discover the tools and capabilities that make Lumina the perfect choice for modern digital experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 group cursor-pointer"
            >
              <div className="text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-white transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
