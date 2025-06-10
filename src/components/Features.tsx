
import { Zap, Target, TrendingUp, Users, BarChart3, MessageSquare, Phone, Mail, Calendar, Workflow } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Lead Generation Funnels",
      description: "Convert visitors into customers with high-converting landing pages, forms, and automated follow-up sequences."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "CRM & Pipeline Management",
      description: "Track every lead from first contact to closed deal with our comprehensive customer relationship management system."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Multi-Channel Messaging",
      description: "Reach customers via SMS, email, voice calls, and social media - all from one unified platform."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Appointment Scheduling",
      description: "Automated booking system with calendar integration, reminders, and no-show reduction features."
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Marketing Automation",
      description: "Set up complex workflows that nurture leads and customers automatically based on their behavior."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Reporting",
      description: "Track ROI, conversion rates, and campaign performance with detailed analytics and custom reports."
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Voice & Call Tracking",
      description: "Local phone numbers, call recording, and call tracking to monitor and improve your phone conversions."
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Marketing",
      description: "Professional email campaigns with advanced segmentation, A/B testing, and delivery optimization."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Website & Funnel Builder",
      description: "Create stunning websites and sales funnels with our drag-and-drop builder - no coding required."
    }
  ];

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Complete <span className="font-semibold">Marketing Suite</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Everything you need to attract, convert, and retain customers - powered by GoHighLevel's industry-leading platform.
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
