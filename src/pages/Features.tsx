import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Phone, 
  MessageSquare, 
  Calendar, 
  ClipboardList, 
  Clock, 
  Zap,
  BarChart,
  Shield
} from "lucide-react";

const Features = () => {
  const automationFeatures = [
    {
      icon: Phone,
      title: "24/7 Call Answering",
      description: "Never miss a call again. Our AI answers instantly, day or night, weekends and holidays included."
    },
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description: "Advanced AI understands context, handles complex questions, and provides accurate information about your business."
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Automatically books appointments directly into your calendar based on your availability and preferences."
    },
    {
      icon: ClipboardList,
      title: "Lead Qualification",
      description: "Intelligently screens and qualifies leads, collecting key information and routing hot prospects to your team."
    },
    {
      icon: Clock,
      title: "Instant Response",
      description: "Zero wait times for callers. Every call is answered immediately, improving customer satisfaction."
    },
    {
      icon: Zap,
      title: "Smart Integrations",
      description: "Seamlessly connects with your CRM, calendar, and other business tools to keep everything in sync."
    },
    {
      icon: BarChart,
      title: "Call Analytics",
      description: "Track call volume, conversion rates, and customer insights with detailed analytics and reporting."
    },
    {
      icon: Shield,
      title: "Reliable & Secure",
      description: "Enterprise-grade security and 99.9% uptime ensure your business communications are always protected."
    }
  ];

  const howItWorksSteps = [
    {
      number: 1,
      title: "Quick Setup",
      description: "Sign up and configure your AI receptionist in just 10 minutes. Tell us about your business, services, and how you want calls handled."
    },
    {
      number: 2,
      title: "AI Learns Your Business",
      description: "Our AI adapts to your specific needs, learning your services, pricing, availability, and business processes."
    },
    {
      number: 3,
      title: "Calls Start Flowing",
      description: "Forward your business number to your new AI receptionist. Calls are answered instantly with natural, professional conversations."
    },
    {
      number: 4,
      title: "Automated Actions",
      description: "AI automatically qualifies leads, books appointments, answers questions, and routes urgent calls to your team."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              How Our Voice AI Automation Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how Veridian Enterprises LLC's Voice AI captures every call, qualifies leads, and books appointments automatically—so you can focus on growing your business.
            </p>
          </div>

          {/* How It Works */}
          <HowItWorks steps={howItWorksSteps} title="The Automation Process" subtitle="From setup to success in four simple steps" />

          {/* Features Grid */}
          <section className="py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Powerful Automation Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to automate your phone communications and never miss a revenue opportunity
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {automationFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="border-border bg-card hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12">
            <Card className="border-primary bg-primary/5">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Automate Your Business Communications?
                </h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join businesses that are capturing every call and maximizing revenue with Voice AI automation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/lost-revenue-calculator">
                    <Button size="lg">
                      Calculate Your Lost Revenue
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
