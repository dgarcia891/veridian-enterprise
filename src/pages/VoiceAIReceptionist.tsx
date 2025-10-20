import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Phone, Clock, CheckCircle, DollarSign, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const VoiceAIReceptionist = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const features = [
    {
      icon: <Clock className="w-12 h-12" />,
      title: "24/7 Revenue Capture",
      points: [
        "Zero missed calls - never lose revenue from unanswered inquiries",
        "Routine question management frees your staff for in-person service",
        "Complex transaction handling including full to-go orders with specific instructions"
      ]
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: "Seamless Integration",
      points: [
        "Links directly with your existing ordering and delivery software via API",
        "Real-time status updates based on current order volumes",
        "Automated appointment booking directly into your business calendar"
      ]
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Lead Qualification",
      points: [
        "Asks specific questions about budget, scope, and timing",
        "Filters out non-ideal customers to save owner time",
        "Automatically schedules qualified leads"
      ]
    }
  ];

  const benefits = [
    "Stop accidentally letting money go out the window - salvage calls already trying to reach you",
    "One salvaged high-ticket call per year can cover the entire annual cost",
    "Enhanced efficiency by offloading repetitive inquiries",
    "Superior customer service - answering is always better than not answering",
    "Blow away your competitors with cutting-edge technology",
    "Future-proof investment that gets smarter over time"
  ];

  const industries = {
    "High-Volume Businesses": [
      "Restaurants & Takeaways",
      "Pizza Shops",
      "Florists",
      "Hairdressers & Salons",
      "Dentists & Vets",
      "Sunbed Shops & Gyms",
      "Hotels",
      "Kids Play Parks",
      "Indoor Climbing Walls",
      "Zoos"
    ],
    "High-Value Businesses": [
      "Construction Companies",
      "HVAC Companies",
      "Estate Agents",
      "Car Dealerships",
      "Home Service Providers"
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Intelligent Voice AI Agent
          </h1>
          <p className="text-2xl md:text-3xl text-primary mb-6 font-light">
            Never Miss a Customer (Or a Sale) Again
          </p>
          <p className="text-xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            For local businesses, every unanswered phone call represents lost revenue. Our cutting-edge Voice AI Agent service ensures that your business is open and ready to transact 24 hours a day, providing instant, intelligent customer service that maximizes your daily sales opportunities.
          </p>
        </div>

        {/* Features Grid */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Service Features & Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/5 p-8 rounded-lg border border-white/10 hover:border-primary/50 transition-all duration-300"
              >
                <div className="text-primary mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <ul className="space-y-3">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary mr-2 mt-1">•</span>
                      <span className="text-white/80 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-lg border border-white/10 mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Benefits for Your Business</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" />
                <p className="text-white/80">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-6 text-center">Pricing Information</h2>
          <p className="text-white/70 mb-12 text-center max-w-3xl mx-auto">
            We believe in justifying our cost by the revenue we generate for you, providing high value without locking you into rigid terms.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white/5 border border-white/10 rounded-lg">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-white font-semibold">Component</th>
                  <th className="p-4 text-left text-white font-semibold">Standard Investment</th>
                  <th className="p-4 text-left text-white font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/80 font-medium">Monthly Service Fee</td>
                  <td className="p-4 text-primary font-semibold">$500</td>
                  <td className="p-4 text-white/70">Standard rate for a fully operational AI Agent</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/80 font-medium">Setup Fee</td>
                  <td className="p-4 text-primary font-semibold">At least $450</td>
                  <td className="p-4 text-white/70">Initial fee for customizing, training, and integrating the agent</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-4 text-white/80 font-medium">Commitment</td>
                  <td className="p-4 text-primary font-semibold">Month-to-Month</td>
                  <td className="p-4 text-white/70">No long-term contract; cancel anytime if not satisfied</td>
                </tr>
                <tr>
                  <td className="p-4 text-white/80 font-medium">Annual Savings Plan</td>
                  <td className="p-4 text-primary font-semibold">$2,500</td>
                  <td className="p-4 text-white/70">Prepay for one year with significant discount (often includes free setup or second agent)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-white/90 text-center">
              <span className="font-semibold">Example ROI:</span> Missing just 10 calls per day at $75 average order value = 
              <span className="text-primary font-bold"> $5,250/week lost revenue</span>. Our service fee is a fraction of what we help you recover.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { num: "1", title: "Identify the Loss", desc: "Calculate exactly how much revenue you're losing from missed calls" },
              { num: "2", title: "Rapid Customization", desc: "Use proven templates customized quickly for your industry" },
              { num: "3", title: "Knowledge Training", desc: "Your website content trains the agent on prices, hours, and services" },
              { num: "4", title: "Live Demo", desc: "See the agent handle complex, industry-specific questions in real-time" },
              { num: "5", title: "Simple Delivery", desc: "Often a 10-minute setup - fill out a form and your agent is deployed" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{step.num}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-white/70 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Industries Served */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Industries We Serve</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(industries).map(([category, businesses], index) => (
              <div key={index} className="bg-white/5 p-8 rounded-lg border border-white/10">
                <h3 className="text-xl font-bold mb-6 text-primary">{category}</h3>
                <ul className="grid grid-cols-2 gap-3">
                  {businesses.map((business, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-primary mr-2">✓</span>
                      <span className="text-white/80 text-sm">{business}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-lg border border-white/10">
          <h2 className="text-3xl font-bold mb-6">Ready to Stop Missing Calls?</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Let's calculate exactly how much revenue you're losing and show you how our Voice AI Agent can transform your business.
          </p>
          <Button
            onClick={scrollToContact}
            className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors text-lg"
          >
            Schedule Your Live Demo
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VoiceAIReceptionist;
