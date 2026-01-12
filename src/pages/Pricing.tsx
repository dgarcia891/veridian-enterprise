import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "AI Agent",
      price: "$600",
      period: "month",
      description: "Core AI Voice & Chat Agent - Integrations Extra",
      popular: true,
      features: [
        "AI Voice Receptionist (24/7)",
        "Unlimited call handling",
        "Natural conversation AI",
        "Multi-language support",
        "Lead qualification",
        "Appointment booking",
        "Email notifications",
        "Basic analytics dashboard",
        "Email & phone support",
        "Integrations available for additional cost",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Pricing - AI Agents 3000</title>
        <meta 
          name="description" 
          content="Choose the perfect AI automation plan for your business. From starter to enterprise, we have solutions that scale with you." 
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
                $600/month for AI Agent base. Integrations & add-ons available.
              </p>
            </div>

            <div className="flex justify-center mb-12">
              {plans.map((plan) => (
                <Card 
                  key={plan.name}
                  className="glass-card relative border-primary/50 shadow-xl max-w-md w-full"
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
                      onClick={() => navigate('/schedule-consultation')}
                    >
                      Book Demo
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
                    <h3 className="font-semibold mb-2">Can I change plans later?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes! You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
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
