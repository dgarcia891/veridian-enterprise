import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Target, Users, TrendingUp, BarChart3, Zap, Shield } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Target className="w-12 h-12" />,
      title: "Lead Generation",
      description: "Transform your social media followers into qualified leads with our proven conversion strategies.",
      features: [
        "Targeted content strategies",
        "Lead magnet optimization",
        "Landing page conversion",
        "A/B testing and optimization"
      ]
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "CRM & Pipeline Management",
      description: "Streamline your sales process with integrated CRM tools designed for social media leads.",
      features: [
        "Automated lead scoring",
        "Pipeline visualization",
        "Contact management",
        "Integration with major platforms"
      ]
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Marketing Automation",
      description: "Save time and increase efficiency with intelligent automation that works around the clock.",
      features: [
        "Automated posting schedules",
        "Drip campaign management",
        "Behavioral triggers",
        "Multi-channel coordination"
      ]
    },
    {
      icon: <BarChart3 className="w-12 h-12" />,
      title: "Analytics & Reporting",
      description: "Gain deep insights into your marketing performance with comprehensive analytics dashboards.",
      features: [
        "Real-time performance tracking",
        "ROI measurement",
        "Custom reporting",
        "Competitive analysis"
      ]
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Growth Strategy",
      description: "Develop and execute data-driven growth strategies tailored to your business goals.",
      features: [
        "Market analysis",
        "Audience segmentation",
        "Content strategy planning",
        "Performance optimization"
      ]
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Brand Protection",
      description: "Monitor and protect your brand reputation across all social media platforms.",
      features: [
        "Sentiment analysis",
        "Crisis management",
        "Reputation monitoring",
        "Response automation"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Comprehensive social media marketing solutions designed to drive measurable business results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/5 p-8 rounded-lg border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="text-primary mb-4">{service.icon}</div>
              <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
              <p className="text-white/70 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <section className="bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-lg border border-white/10 mb-20">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Discovery</h3>
              <p className="text-white/70 text-sm">We analyze your business, goals, and current marketing efforts.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Strategy</h3>
              <p className="text-white/70 text-sm">We develop a customized marketing strategy tailored to your needs.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Implementation</h3>
              <p className="text-white/70 text-sm">We execute the strategy with precision and ongoing optimization.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Growth</h3>
              <p className="text-white/70 text-sm">We continuously refine and scale your marketing for maximum ROI.</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Let's discuss how our services can help transform your social media presence into a revenue-generating machine.
          </p>
          <a
            href="#contact"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Schedule a Consultation
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
