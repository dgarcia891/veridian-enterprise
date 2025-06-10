
import { Zap, Target, TrendingUp, Users, BarChart3, MessageSquare } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Strategic Planning",
      description: "Data-driven social media strategies tailored to your brand's goals and target audience."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Marketing",
      description: "Accelerate your follower growth and engagement with proven tactics that convert."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights",
      description: "Comprehensive reporting and performance tracking to optimize your social media ROI."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Content Creation",
      description: "Compelling, platform-optimized content that resonates with your audience and drives action."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Management",
      description: "Build and nurture engaged communities around your brand with expert social listening."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Paid Advertising",
      description: "Maximize your ad spend with targeted campaigns across all major social platforms."
    }
  ];

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Our <span className="font-semibold">Services</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Comprehensive social media marketing solutions designed to elevate your brand and drive measurable results.
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
