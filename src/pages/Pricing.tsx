import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "month",
      description: "Perfect for small businesses getting started",
      popular: false,
      features: [
        "Up to 100 calls/month",
        "Business hours coverage",
        "1 language (English)",
        "Basic FAQ responses",
        "Email notifications",
        "Standard voice AI",
        "Email support",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Growth",
      price: "$199",
      period: "month",
      description: "For growing businesses that need 24/7 coverage",
      popular: true,
      features: [
        "Up to 500 calls/month",
        "24/7 availability",
        "5 languages supported",
        "Lead qualification",
        "Appointment booking",
        "SMS & email notifications",
        "Basic analytics dashboard",
        "Email & chat support",
      ],
      cta: "Get Started",
    },
    {
      name: "Professional",
      price: "$600",
      period: "month",
      description: "Full-featured AI agent for high-volume businesses",
      popular: false,
      features: [
        "Unlimited call handling",
        "24/7 availability",
        "10+ languages supported",
        "Advanced lead qualification",
        "CRM integration",
        "Full analytics & reporting",
        "Priority dedicated support",
        "Custom AI training",
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - AI Voice Receptionist Plans from $99/mo | AI Agents 3000</title>
        <meta 
          name="description" 
          content="AI voice receptionist plans starting at $99/month. Choose Starter, Growth, or Professional. No setup fees, 30-day money-back guarantee." 
        />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Plans starting at $99/month — scale as you grow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {plans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={`glass-card relative transition-all duration-300 hover:scale-105 ${
                    plan.popular ? 'border-2 border-primary shadow-xl shadow-primary/10' : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-6"
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => navigate(`/signup?plan=${plan.name.toLowerCase()}`)}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-16 space-y-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>All Plans Include</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Free setup & onboarding</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>No long-term contracts</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>Cancel anytime</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Can I upgrade my plan later?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes! You can upgrade at any time. Changes take effect immediately and you'll be prorated for the remaining billing period.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">What happens if I exceed my call limit?</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll notify you when you're approaching your limit. You can upgrade to a higher plan or pay a small per-call overage fee.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Is there a setup fee?</h3>
                    <p className="text-sm text-muted-foreground">
                      No setup fees on any plan. We'll help you get started for free, including initial AI training and configuration.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Do you offer annual discounts?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes! Pay annually and save 20% on any plan. Contact us for annual pricing details.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Can I add the Chat Widget to any plan?</h3>
                    <p className="text-sm text-muted-foreground">
                      The AI Chat Widget is available as an add-on starting at $150/month on any Voice AI plan.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Comparison Links */}
              <Card className="glass-card border-primary/20">
                <CardHeader>
                  <CardTitle>See How We Compare</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Not sure how we stack up? Check out our detailed competitor comparisons.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to="/compare/vs-smith-ai">
                      <Button variant="outline" className="w-full sm:w-auto">
                        vs Smith.ai <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/compare/vs-my-ai-front-desk">
                      <Button variant="outline" className="w-full sm:w-auto">
                        vs My AI Front Desk <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link to="/compare/vs-dialzara">
                      <Button variant="outline" className="w-full sm:w-auto">
                        vs Dialzara <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Pricing;
