import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ComparisonTable, { ComparisonFeature } from "@/components/ComparisonTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Shield, Brain, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features: ComparisonFeature[] = [
  { feature: "Starting Price", us: "$99/mo", competitor: "Free (limited)" },
  { feature: "Pro/Growth Plan", us: "$199/mo (500 calls)", competitor: "~$99/mo", highlight: true },
  { feature: "Unlimited Calls", us: "$600/mo (Pro)", competitor: "Not available" },
  { feature: "24/7 Availability", us: true, competitor: true },
  { feature: "Multi-Language Support", us: "10+ languages", competitor: "Limited" },
  { feature: "Lead Qualification", us: "Advanced (Growth+)", competitor: "Basic" },
  { feature: "Appointment Booking", us: true, competitor: true },
  { feature: "CRM Integration", us: "Pro plan", competitor: "Limited integrations" },
  { feature: "Custom AI Training", us: "Pro plan", competitor: "Basic customization" },
  { feature: "SMS Notifications", us: "Growth & Pro", competitor: "Basic" },
  { feature: "Analytics Dashboard", us: "Growth & Pro", competitor: "Basic" },
  { feature: "Chat Widget Add-on", us: "$150/mo (95+ languages)", competitor: "Not available", highlight: true },
  { feature: "HIPAA Compliance", us: "Available (Pro)", competitor: "Not available", highlight: true },
  { feature: "Dedicated Support", us: "Pro plan", competitor: "Email only" },
  { feature: "Setup Time", us: "10 minutes", competitor: "15–30 minutes" },
  { feature: "White-Label Option", us: "—", competitor: "Available" },
];

const VsMyAIFrontDesk = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Agents 3000 vs My AI Front Desk — AI Receptionist Comparison",
    description: "Compare AI Agents 3000 and My AI Front Desk. See pricing, features, integrations, and which AI receptionist is right for your business.",
    url: "https://aiagents3000.com/compare/vs-my-ai-front-desk",
  };

  return (
    <>
      <Helmet>
        <title>AI Agents 3000 vs My AI Front Desk — Full Comparison 2026</title>
        <meta
          name="description"
          content="AI Agents 3000 vs My AI Front Desk: Compare pricing, features, language support, and integrations. See why businesses choose AI Agents 3000 for serious growth."
        />
        <link rel="canonical" href="https://aiagents3000.com/compare/vs-my-ai-front-desk" />
        <meta property="og:title" content="AI Agents 3000 vs My AI Front Desk — Which Is Better?" />
        <meta property="og:description" content="Full comparison of AI receptionist platforms. Pricing, features, and real differences." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main>
          {/* Hero */}
          <section className="relative py-20 md:py-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="max-w-4xl mx-auto px-6 text-center relative">
              <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
                Comparison
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                AI Agents 3000 vs <span className="text-primary">My AI Front Desk</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                My AI Front Desk is great for getting started. But when you need <strong className="text-foreground">enterprise-grade features</strong>,
                multi-language support, and unlimited calls — AI Agents 3000 scales with you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" onClick={() => navigate("/schedule-consultation")}>
                  Try AI Agents 3000 Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/roi-calculator")}>
                  Calculate Your ROI
                </Button>
              </div>
            </div>
          </section>

          {/* Key Differentiators */}
          <section className="py-16 bg-muted/30">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Globe,
                    title: "10+ Languages vs Limited",
                    desc: "Serve diverse customer bases with fluent multi-language AI. My AI Front Desk offers limited language options.",
                  },
                  {
                    icon: Brain,
                    title: "Advanced Lead Qualification",
                    desc: "Our AI asks budget, timeline, and scope questions. Qualify leads before they reach your team — not after.",
                  },
                  {
                    icon: Shield,
                    title: "HIPAA Compliance Available",
                    desc: "Need healthcare compliance? Our Pro plan includes HIPAA-ready infrastructure. My AI Front Desk doesn't offer this.",
                  },
                ].map((item, idx) => (
                  <Card key={idx} className="glass-card border-border">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
                Feature-by-Feature Comparison
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                Both platforms offer AI receptionists — but the details matter when your business depends on it.
              </p>
              <ComparisonTable features={features} competitorName="My AI Front Desk" />
            </div>
          </section>

          {/* When to Choose Each */}
          <section className="py-16 bg-muted/30">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Which Is Right for You?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="glass-card border-primary/50">
                  <CardContent className="p-8">
                    <Badge className="mb-4 bg-primary text-primary-foreground">Choose AI Agents 3000 If…</Badge>
                    <ul className="space-y-3 text-sm">
                      {[
                        "You need unlimited call handling",
                        "Multi-language support is essential",
                        "You want advanced lead qualification",
                        "HIPAA compliance is required",
                        "You need CRM integrations",
                        "You want a dedicated support team",
                        "You plan to add a chat widget later",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="glass-card border-border">
                  <CardContent className="p-8">
                    <Badge variant="outline" className="mb-4">Choose My AI Front Desk If…</Badge>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {[
                        "You're a solopreneur testing AI",
                        "Budget is your #1 concern",
                        "You only need basic call answering",
                        "English-only is sufficient",
                        "You want white-label capabilities",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 md:py-24">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Level Up Your AI Receptionist?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start with our $99/mo Starter plan and upgrade as you grow. No contracts, no risk.
              </p>
              <Button size="lg" onClick={() => navigate("/schedule-consultation")}>
                Schedule Free Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </section>
          <ComparisonFAQ
            competitorName="My AI Front Desk"
            extraFaqs={[
              {
                question: "My AI Front Desk is cheaper — what extra do I get with AI Agents 3000?",
                answer: "AI Agents 3000 includes 15+ CRM integrations, 10+ languages, advanced lead qualification, and appointment scheduling out of the box. My AI Front Desk's lower price comes with fewer integrations and limited customization options.",
              },
            ]}
          />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VsMyAIFrontDesk;
