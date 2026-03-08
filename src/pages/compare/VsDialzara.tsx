import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ComparisonTable, { ComparisonFeature } from "@/components/ComparisonTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Phone, Globe, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features: ComparisonFeature[] = [
  { feature: "Starting Price", us: "$99/mo", competitor: "$29/mo (60 min)", highlight: true },
  { feature: "Mid-Tier Plan", us: "$199/mo (500 calls)", competitor: "$99/mo (200 min)" },
  { feature: "Unlimited Calls", us: "$600/mo (Pro)", competitor: "Not available", highlight: true },
  { feature: "24/7 Availability", us: true, competitor: true },
  { feature: "Multi-Language Support", us: "10+ languages", competitor: "Limited" },
  { feature: "Lead Qualification", us: "Advanced (Growth+)", competitor: "Basic" },
  { feature: "Appointment Booking", us: true, competitor: true },
  { feature: "CRM Integration", us: "Pro plan", competitor: "Via Zapier/Make" },
  { feature: "Warm Call Transfer", us: true, competitor: "Business+ only ($99/mo)" },
  { feature: "Custom AI Training", us: "Pro plan", competitor: "Self-editable prompt" },
  { feature: "SMS Notifications", us: "Growth & Pro", competitor: true },
  { feature: "Analytics Dashboard", us: "Growth & Pro", competitor: "Basic" },
  { feature: "Chat Widget Add-on", us: "$150/mo (95+ languages)", competitor: "Not available", highlight: true },
  { feature: "HIPAA Compliance", us: "Available (Pro)", competitor: "Not available" },
  { feature: "Dedicated Support", us: "Pro plan", competitor: "Email" },
  { feature: "Free Trial", us: "Yes", competitor: "7 days" },
  { feature: "Billing Model", us: "Per call", competitor: "Per minute", highlight: true },
];

const VsDialzara = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Agents 3000 vs Dialzara — AI Receptionist Comparison",
    description: "Compare AI Agents 3000 and Dialzara AI receptionist services. Pricing, features, and which platform is best for growing businesses.",
    url: "https://aiagents3000.com/compare/vs-dialzara",
  };

  return (
    <>
      <Helmet>
        <title>AI Agents 3000 vs Dialzara — Pricing & Feature Comparison 2026</title>
        <meta
          name="description"
          content="Compare AI Agents 3000 vs Dialzara: per-call vs per-minute billing, unlimited calls, 10+ languages, HIPAA compliance, and advanced lead qualification."
        />
        <link rel="canonical" href="https://aiagents3000.com/compare/vs-dialzara" />
        <meta property="og:title" content="AI Agents 3000 vs Dialzara — Which AI Receptionist Wins?" />
        <meta property="og:description" content="Full pricing & feature comparison between AI Agents 3000 and Dialzara." />
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
                AI Agents 3000 vs <span className="text-primary">Dialzara</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Dialzara offers affordable per-minute AI receptionist plans starting at $29/month.
                AI Agents 3000 offers <strong className="text-foreground">per-call billing</strong>,
                unlimited calls on Pro, and enterprise features that scale with your business.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" onClick={() => navigate("/schedule-consultation")}>
                  Try AI Agents 3000 Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/roi-calculator")}>
                  Calculate Your Savings
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
                    icon: Phone,
                    title: "Per-Call vs Per-Minute Billing",
                    desc: "Dialzara charges by the minute — long calls cost more. We charge per call, so a 2-minute and 20-minute call cost the same.",
                  },
                  {
                    icon: Globe,
                    title: "10+ Languages Built In",
                    desc: "Serve diverse communities with fluent multi-language AI from day one. Dialzara offers limited language support.",
                  },
                  {
                    icon: Brain,
                    title: "Advanced Lead Qualification",
                    desc: "Our AI asks budget, timeline, and scope questions to qualify leads before they reach you — not just take messages.",
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
                Both are AI-first receptionist platforms — here's where they differ.
              </p>
              <ComparisonTable features={features} competitorName="Dialzara" />
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
                        "You handle high call volumes",
                        "Long calls are common (no per-minute anxiety)",
                        "Multi-language support is needed",
                        "You want advanced lead qualification",
                        "HIPAA compliance is required",
                        "You need CRM integrations",
                        "You want to add a chat widget",
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
                    <Badge variant="outline" className="mb-4">Choose Dialzara If…</Badge>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {[
                        "You're on a very tight budget ($29/mo)",
                        "You receive very few, short calls",
                        "Basic message-taking is sufficient",
                        "You prefer Zapier/Make integrations",
                        "English-only is fine",
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
                Ready for an AI Receptionist That Scales?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start at $99/mo with per-call billing. Upgrade to unlimited as you grow. No contracts.
              </p>
              <Button size="lg" onClick={() => navigate("/schedule-consultation")}>
                Schedule Free Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VsDialzara;
