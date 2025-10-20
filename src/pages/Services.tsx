import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Target, Users, TrendingUp, BarChart3, Zap, Shield } from "lucide-react";

const Services = () => {
  const scrollToAIPage = () => {
    window.location.href = '/voice-ai-receptionist';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Professional Voice AI receptionist services designed to capture every customer opportunity.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-20">
          <div
            onClick={scrollToAIPage}
            className="bg-white/5 p-12 rounded-lg border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 cursor-pointer group"
          >
            <div className="text-primary mb-6">
              <Target className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-center">Voice AI Receptionist</h2>
            <p className="text-xl text-white/70 mb-8 text-center">
              Never miss a customer call again with our intelligent 24/7 Voice AI Agent service
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-primary mr-3 text-xl">✓</span>
                <span className="text-white/80">24/7 availability - capture every sales opportunity</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 text-xl">✓</span>
                <span className="text-white/80">Handle complex orders and transactions automatically</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 text-xl">✓</span>
                <span className="text-white/80">Seamless integration with your existing systems</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 text-xl">✓</span>
                <span className="text-white/80">Intelligent lead qualification and appointment booking</span>
              </li>
            </ul>
            <div className="text-center">
              <span className="text-white/70 group-hover:text-white transition-colors">
                Click to learn more →
              </span>
            </div>
          </div>
        </div>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Stop Missing Calls?</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Let's calculate how much revenue you're losing from missed calls and show you how our Voice AI Agent can help.
          </p>
          <a
            href="#contact"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Schedule Your Free Demo
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
