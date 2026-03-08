import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageCircle, Check, ArrowRight, Zap, Clock, Globe } from "lucide-react";
import { Helmet } from "react-helmet";
import { useNavigate, Link } from "react-router-dom";
import { services } from "@/data/services";

const Services = () => {
  const navigate = useNavigate();

  const serviceIcons: Record<string, React.ReactNode> = {
    "voice-ai-receptionist": <Phone className="w-12 h-12" />,
    "ai-chat-widget": <MessageCircle className="w-12 h-12" />,
  };

  const serviceHighlights: Record<string, { icon: React.ReactNode; text: string }[]> = {
    "voice-ai-receptionist": [
      { icon: <Clock className="w-4 h-4" />, text: "24/7 Availability" },
      { icon: <Globe className="w-4 h-4" />, text: "10+ Languages" },
      { icon: <Zap className="w-4 h-4" />, text: "Instant Setup" },
    ],
    "ai-chat-widget": [
      { icon: <Globe className="w-4 h-4" />, text: "95+ Languages" },
      { icon: <Zap className="w-4 h-4" />, text: "Easy Training" },
      { icon: <MessageCircle className="w-4 h-4" />, text: "Smart Capture" },
    ],
  };

  return (
    <>
      <Helmet>
        <title>AI-Powered Business Solutions - Voice & Chat Agents | AI Agents 3000</title>
        <meta name="description" content="Discover our AI-powered solutions: Voice AI Receptionist for 24/7 call handling and AI Chat Widget for intelligent website engagement. Never miss a customer again." />
        <link rel="canonical" href="https://aiagents3000.com/services" />
        <meta property="og:title" content="AI-Powered Business Solutions - Voice & Chat Agents" />
        <meta property="og:description" content="Transform your business with AI. 24/7 voice receptionist and intelligent chat solutions that capture every opportunity." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiagents3000.com/services" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI-Powered Business Solutions - Voice & Chat Agents" />
        <meta name="twitter:description" content="Transform your business with AI. 24/7 voice receptionist and intelligent chat solutions." />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        
        <main>
          {/* Hero Section */}
          <section className="relative py-20 md:py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="max-w-6xl mx-auto px-6 relative">
              <div className="text-center max-w-4xl mx-auto">
                <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
                  AI-Powered Solutions
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Our Services
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  Professional AI agents designed to capture every customer opportunity. 
                  From phone calls to website chats, we've got you covered 24/7.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    No missed calls
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    24/7 availability
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Setup in minutes
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {services.filter(s => s.active).map((service) => (
                  <div
                    key={service.id}
                    className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
                  >
                    {/* Card Header */}
                    <div className="p-8 pb-0">
                      <div className="flex items-start justify-between mb-6">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          {serviceIcons[service.slug]}
                        </div>
                        {service.pricing[0]?.popular && (
                          <Badge className="bg-primary text-primary-foreground">
                            Most Popular
                          </Badge>
                        )}
                      </div>
                      
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        {service.name}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {service.description}
                      </p>

                      {/* Quick Highlights */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        {serviceHighlights[service.slug]?.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground"
                          >
                            {highlight.icon}
                            {highlight.text}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="px-8 pb-6">
                      <ul className="space-y-3">
                        {service.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {feature.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="p-8 pt-4 border-t border-border bg-muted/30">
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Starting at</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">
                              {service.pricing[0]?.price}
                            </span>
                            <span className="text-muted-foreground">
                              {service.pricing[0]?.period}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => navigate(`/${service.slug}`)}
                          className="group/btn"
                        >
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {service.pricing[0]?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Combined Package Section */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
                Complete Solution
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Get Both for Maximum Coverage
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Combine Voice AI Receptionist with AI Chat Widget for complete customer 
                coverage across phone and web channels.
              </p>
              
              <div className="bg-card rounded-2xl border border-border p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Phone className="w-6 h-6" />
                    </div>
                    <span className="font-semibold">Voice AI</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">+</span>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="font-semibold">Chat Widget</span>
                  </div>
                  <span className="text-2xl font-bold text-muted-foreground">=</span>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">$249<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Phone coverage
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Website coverage
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Unified dashboard
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => navigate('/schedule-consultation')}
                className="px-8"
              >
                Schedule Free Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Stop Missing Opportunities?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's calculate how much revenue you're losing and show you exactly 
                how our AI agents can help capture it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/schedule-consultation')}
                >
                  Schedule Demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/roi-calculator')}
                >
                  Calculate Your ROI
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
                <span className="text-muted-foreground">See how we compare:</span>
                <Link to="/compare/vs-smith-ai" className="text-primary hover:underline">vs Smith.ai</Link>
                <Link to="/compare/vs-my-ai-front-desk" className="text-primary hover:underline">vs My AI Front Desk</Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Services;
