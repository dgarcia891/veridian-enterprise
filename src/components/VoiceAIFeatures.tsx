import { Phone, Clock, Zap, CheckCircle, DollarSign, Target } from "lucide-react";

const VoiceAIFeatures = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Never miss a call again. Our AI answers every inquiry instantly, day or night, ensuring zero lost revenue from unanswered calls."
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Complex Order Handling",
      description: "Manages intricate transactions including complete to-go orders, specific instructions, and delivery requirements with precision."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Seamless Integration",
      description: "Links directly with your existing ordering, delivery, or operational software via API for automated processing."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Lead Qualification",
      description: "Asks specific questions about budget, scope, and timing to filter non-ideal customers and save your time."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Appointment Booking",
      description: "Qualified leads are automatically scheduled and booked directly into your business calendar."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Real-Time Updates",
      description: "Provides accurate service times by checking current order volumes and estimated delivery durations."
    }
  ];

  return (
    <section id="features" className="py-32 px-6" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 id="features-heading" className="text-4xl md:text-5xl font-light text-white mb-6">
            Intelligent <span className="font-semibold">Voice AI</span> Features
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Everything you need to capture every customer call and turn inquiries into revenue - powered by cutting-edge AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Voice AI features">
          {features.map((feature, index) => (
            <div
              key={index}
              role="listitem"
              className="glass-card rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 group"
            >
              <div className="text-white mb-6 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
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

export default VoiceAIFeatures;
