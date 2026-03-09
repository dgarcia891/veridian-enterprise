import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ComparisonTable, { ComparisonFeature } from "@/components/ComparisonTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, DollarSign, Clock, Globe } from "lucide-react";
import ComparisonFAQ from "@/components/compare/ComparisonFAQ";
import { useNavigate } from "react-router-dom";

const features: ComparisonFeature[] = [
  { feature: "Starting Price", us: "$99/mo", competitor: "$235/mo (50 min)", highlight: true },
  { feature: "24/7 Availability", us: true, competitor: "Business hours only", highlight: true },
  { feature: "AI-Powered", us: true, competitor: "Human receptionists" },
  { feature: "Unlimited Calls (Pro)", us: "$600/mo", competitor: "Per-minute overage" },
  { feature: "Multi-Language Support", us: "10+ languages", competitor: "English only" },
  { feature: "Setup Time", us: "10 minutes", competitor: "1–2 weeks" },
  { feature: "Lead Qualification", us: true, competitor: true },
  { feature: "Appointment Booking", us: true, competitor: true },
  { feature: "CRM Integration", us: "Pro plan", competitor: "Limited" },
  { feature: "Per-Minute Overage Fees", us: "None on Pro", competitor: "$5.50+/min", highlight: true },
  { feature: "Setup Fee", us: "$0", competitor: "$0" },
  { feature: "Contract Required", us: false, competitor: false },
  { feature: "SMS & Chat Widget", us: "Add-on available", competitor: false },
  { feature: "Custom AI Training", us: "Pro plan", competitor: "—" },
  { feature: "Analytics Dashboard", us: "Growth & Pro", competitor: "Basic" },
];

const VsRubyReceptionists = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Agents 3000 vs Ruby Receptionists — AI Receptionist Comparison",
    description: "Compare AI Agents 3000 and Ruby Receptionists. See pricing, features, and which virtual receptionist is best for your business.",
    url: "https://aiagents3000.com/compare/vs-ruby-receptionists",
  };

  return (
    <>
      <Helmet>
        <title>AI Agents 3000 vs Ruby Receptionists — Pricing & Feature Comparison 2026</title>
        <meta
          name="description"
          content="Compare AI Agents 3000 vs Ruby Receptionists: AI-powered 24/7 coverage from $99/mo vs human receptionists at $235/mo for 50 minutes. See the full breakdown."
        />
        <link rel="canonical" href="https://aiagents3000.com/compare/vs-ruby-receptionists" />
        <meta property="og:title" content="AI Agents 3000 vs Ruby Receptionists — Which Receptionist Service Is Better?" />
        <meta property="og:description" content="Full pricing & feature comparison. AI Agents 3000 starts at $99/mo vs Ruby at $235/mo." />
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
                AI Agents 3000 vs <span className="text-primary">Ruby Receptionists</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Ruby offers human receptionists starting at $235/month for just 50 minutes.
                AI Agents 3000 delivers AI-powered 24/7 call handling from <strong className="text-foreground">$99/month</strong> with
                no per-minute surprises.
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
                    title: "Save 58%+ on Monthly Costs",
                    desc: "Start at $99/mo instead of $235/mo. No $5.50+/min overage fees eating into your budget.",
                  },
                  {
                    icon: Clock,
                    title: "True 24/7 Coverage",
                    desc: "Ruby offers business-hours human receptionists with limited after-hours. Our AI never sleeps, never takes breaks.",
                  },
                  {
                    icon: Globe,
                    title: "10+ Languages vs English Only",
                    desc: "Serve customers in their preferred language. Ruby only supports English — we support 10+ languages out of the box.",
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
                See exactly how AI Agents 3000 stacks up against Ruby Receptionists on the features that matter most.
              </p>
              <ComparisonTable features={features} competitorName="Ruby Receptionists" />
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
                    <Badge variant="outline" className="mb-4">Ruby Receptionists</Badge>
                    <p className="text-4xl font-bold mb-2">$2,820 – $12,000+</p>
                    <p className="text-sm text-muted-foreground mb-4">/year + per-minute overage</p>
                    <ul className="text-left space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-muted-foreground" /> 50–200 minutes included</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-muted-foreground" /> $5.50+/min overage</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-muted-foreground" /> English only</li>
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
                Ready to Switch from Ruby?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get 24/7 AI-powered coverage at a fraction of the cost. Setup takes 10 minutes, not weeks.
              </p>
              <Button size="lg" onClick={() => navigate("/schedule-consultation")}>
                Schedule Free Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </section>
          <ComparisonFAQ
            competitorName="Ruby Receptionists"
            extraFaqs={[
              {
                question: "Ruby offers a personal touch — can AI match that?",
                answer: "AI Agents 3000 is customized with your business's tone, terminology, and preferences. It greets callers by understanding context instantly, handles scheduling, and qualifies leads — all without the per-minute costs that make Ruby expensive at scale.",
              },
            ]}
          />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VsRubyReceptionists;