import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ComparisonTable, { ComparisonFeature } from "@/components/ComparisonTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, DollarSign, Zap, Clock } from "lucide-react";
import ComparisonFAQ from "@/components/compare/ComparisonFAQ";
import { useNavigate } from "react-router-dom";

const features: ComparisonFeature[] = [
  { feature: "Starting Price", us: "$99/mo", competitor: "$300/mo (30 calls)", highlight: true },
  { feature: "24/7 Availability", us: true, competitor: true },
  { feature: "AI-Powered Conversations", us: true, competitor: "Hybrid (AI + Human)" },
  { feature: "Unlimited Calls (Pro)", us: "$600/mo", competitor: "$10+/call overage" },
  { feature: "Multi-Language Support", us: "10+ languages", competitor: "English & Spanish" },
  { feature: "Setup Time", us: "10 minutes", competitor: "Days to weeks" },
  { feature: "Lead Qualification", us: true, competitor: true },
  { feature: "Appointment Booking", us: true, competitor: true },
  { feature: "CRM Integration", us: "Pro plan", competitor: "All plans (extra fee)" },
  { feature: "Per-Call Overage Fees", us: "None on Pro", competitor: "$11.50+/call", highlight: true },
  { feature: "Setup Fee", us: "$0", competitor: "$0" },
  { feature: "Contract Required", us: false, competitor: false },
  { feature: "SMS & Chat Widget", us: "Add-on available", competitor: "Separate product" },
  { feature: "Custom AI Training", us: "Pro plan", competitor: "—" },
  { feature: "Analytics Dashboard", us: "Growth & Pro", competitor: "Basic" },
];

const VsSmithAI = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Agents 3000 vs Smith.ai — AI Receptionist Comparison",
    description: "Compare AI Agents 3000 and Smith.ai virtual receptionist services. See pricing, features, and which is best for your business.",
    url: "https://aiagents3000.com/compare/vs-smith-ai",
  };

  return (
    <>
      <Helmet>
        <title>AI Agents 3000 vs Smith.ai — Pricing & Feature Comparison 2026</title>
        <meta
          name="description"
          content="Compare AI Agents 3000 vs Smith.ai: pricing from $99/mo vs $300/mo, unlimited calls vs per-call fees, 10+ languages, and instant setup. See the full breakdown."
        />
        <link rel="canonical" href="https://aiagents3000.com/compare/vs-smith-ai" />
        <meta property="og:title" content="AI Agents 3000 vs Smith.ai — Which AI Receptionist Is Better?" />
        <meta property="og:description" content="Full pricing & feature comparison. AI Agents 3000 starts at $99/mo vs Smith.ai at $300/mo." />
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
                AI Agents 3000 vs <span className="text-primary">Smith.ai</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Smith.ai offers human receptionists starting at $300/month for 30 calls.
                AI Agents 3000 delivers AI-powered call handling from <strong className="text-foreground">$99/month</strong> with
                no per-call surprises.
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
                    icon: DollarSign,
                    title: "Save 67%+ on Monthly Costs",
                    desc: "Start at $99/mo instead of $300/mo. No $11.50/call overage fees eating into your budget.",
                  },
                  {
                    icon: Zap,
                    title: "10-Minute Setup vs Days",
                    desc: "Smith.ai requires onboarding calls and training periods. We're live in minutes.",
                  },
                  {
                    icon: Clock,
                    title: "True 24/7 AI Coverage",
                    desc: "Smith.ai uses human receptionists with limited hours. Our AI never sleeps, never takes breaks.",
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
                See exactly how AI Agents 3000 stacks up against Smith.ai on the features that matter most.
              </p>
              <ComparisonTable features={features} competitorName="Smith.ai" />
            </div>
          </section>

          {/* Pricing Comparison */}
          <section className="py-16 bg-muted/30">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12">Annual Cost Comparison</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="glass-card border-primary/50">
                  <CardContent className="p-8 text-center">
                    <Badge className="mb-4 bg-primary text-primary-foreground">AI Agents 3000</Badge>
                    <p className="text-4xl font-bold mb-2">$1,188 – $7,200</p>
                    <p className="text-sm text-muted-foreground mb-4">/year depending on plan</p>
                    <ul className="text-left space-y-2 text-sm">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Unlimited calls on Pro</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> No overage fees</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> 10+ languages included</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="glass-card border-border">
                  <CardContent className="p-8 text-center">
                    <Badge variant="outline" className="mb-4">Smith.ai</Badge>
                    <p className="text-4xl font-bold mb-2">$3,600 – $16,800+</p>
                    <p className="text-sm text-muted-foreground mb-4">/year + overage fees</p>
                    <ul className="text-left space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-muted-foreground" /> 30–300 calls included</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-muted-foreground" /> $11.50+/call overage</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-muted-foreground" /> English & Spanish</li>
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
                Ready to Switch from Smith.ai?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get the same 24/7 coverage at a fraction of the cost. Setup takes 10 minutes, not days.
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

export default VsSmithAI;
