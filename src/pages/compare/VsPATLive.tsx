import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ComparisonTable, { ComparisonFeature } from "@/components/ComparisonTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, TrendingUp, Zap } from "lucide-react";
import ComparisonFAQ from "@/components/compare/ComparisonFAQ";
import { useNavigate } from "react-router-dom";

const features: ComparisonFeature[] = [
  { feature: "Base Monthly Cost", us: "$99/mo unlimited", competitor: "$61/mo + $2.85/min", highlight: true },
  { feature: "Per-Minute Fees", us: "None", competitor: "$2.85/min after 50 minutes", highlight: true },
  { feature: "24/7 Availability", us: true, competitor: "Business hours only" },
  { feature: "Setup Time", us: "24-48 hours", competitor: "1-2 weeks" },
  { feature: "AI-Powered", us: true, competitor: false },
  { feature: "CRM Integration", us: "15+ platforms", competitor: "Basic integration" },
  { feature: "Languages", us: "10+", competitor: "English + Spanish" },
  { feature: "Lead Qualification", us: true, competitor: "Limited" },
  { feature: "Appointment Scheduling", us: true, competitor: true },
  { feature: "Call Recording", us: true, competitor: true },
  { feature: "Predictable Monthly Cost", us: true, competitor: false, highlight: true },
  { feature: "No Usage Limits", us: true, competitor: false },
];

const VsPATLive = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Agents 3000 vs PATLive — Unlimited vs Metered Pricing Comparison",
    description:
      "Compare AI Agents 3000's $99/mo unlimited service vs PATLive's $61/mo base + $2.85/min overage model. See which offers better value.",
    url: "https://aiagents3000.com/compare/vs-patlive",
  };

  return (
    <>
      <Helmet>
        <title>AI Agents 3000 vs PATLive — No Overage Fees vs Metered Billing</title>
        <meta
          name="description"
          content="AI Agents 3000 offers unlimited AI receptionist service for $99/mo vs PATLive's $61/mo base + $2.85/min overages. Compare value and features."
        />
        <link rel="canonical" href="https://aiagents3000.com/compare/vs-patlive" />
        <meta property="og:title" content="AI Agents 3000 vs PATLive — Unlimited vs Metered Pricing" />
        <meta
          property="og:description"
          content="Unlimited AI calls for $99/mo vs escalating costs with per-minute overages. See the cost comparison."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main>
          {/* Hero */}
          <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="max-w-4xl mx-auto px-6 text-center relative">
              <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
                Comparison
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                AI Agents 3000 vs <span className="text-primary">PATLive</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Unlimited AI receptionist service for $99/mo vs PATLive's low base price with $2.85/min overage fees that add up quickly.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" onClick={() => navigate("/schedule-consultation")}>
                  Start Free Demo <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/roi-calculator")}>
                  Calculate Your Savings
                </Button>
              </div>
            </div>
          </section>

          {/* Key Differentiators */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Why Unlimited Beats Metered
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center p-8">
                  <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Predictable Costs</h3>
                  <p className="text-muted-foreground">
                    $99/mo flat rate vs $61/mo base that balloons with $2.85/min overage fees
                  </p>
                </Card>
                <Card className="text-center p-8">
                  <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">24/7 AI Coverage</h3>
                  <p className="text-muted-foreground">
                    Always-on AI receptionist vs human service limited to business hours
                  </p>
                </Card>
                <Card className="text-center p-8">
                  <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">No Usage Anxiety</h3>
                  <p className="text-muted-foreground">
                    Handle unlimited calls without watching the clock or worrying about bills
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* Feature Comparison Table */}
          <section className="py-16 md:py-24">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Feature-by-Feature Comparison
              </h2>
              <ComparisonTable features={features} competitorName="PATLive" />
            </div>
          </section>

          {/* Cost Analysis */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Real Cost Comparison
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-bold mb-2">100 Minutes/Month</h3>
                  <div className="space-y-2">
                    <p><strong>AI Agents 3000:</strong> $99/mo</p>
                    <p><strong>PATLive:</strong> $204/mo</p>
                    <p className="text-primary font-bold">Save $105/mo</p>
                  </div>
                </Card>
                <Card className="p-6 text-center border-primary border-2">
                  <Badge className="bg-primary text-primary-foreground mb-2">Most Common</Badge>
                  <h3 className="text-lg font-bold mb-2">200 Minutes/Month</h3>
                  <div className="space-y-2">
                    <p><strong>AI Agents 3000:</strong> $99/mo</p>
                    <p><strong>PATLive:</strong> $489/mo</p>
                    <p className="text-primary font-bold">Save $390/mo</p>
                  </div>
                </Card>
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-bold mb-2">300 Minutes/Month</h3>
                  <div className="space-y-2">
                    <p><strong>AI Agents 3000:</strong> $99/mo</p>
                    <p><strong>PATLive:</strong> $774/mo</p>
                    <p className="text-primary font-bold">Save $675/mo</p>
                  </div>
                </Card>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-muted-foreground mb-6">
                  *PATLive costs calculated as $61 base + $2.85/min for minutes over their 50-minute allowance
                </p>
                <Button size="lg" onClick={() => navigate("/schedule-consultation")}>
                  Start Saving Today <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </section>

          {/* Choose The Right Service */}
          <section className="py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Which Service Is Right for You?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 border-primary border-2">
                  <h3 className="text-xl font-bold text-primary mb-4">Choose AI Agents 3000 If You Want:</h3>
                  <ul className="space-y-3">
                    <li>✓ Predictable monthly costs with no surprises</li>
                    <li>✓ 24/7 availability for all time zones</li>
                    <li>✓ Advanced AI with lead qualification</li>
                    <li>✓ No usage anxiety or minute-watching</li>
                    <li>✓ Modern CRM integrations</li>
                    <li>✓ Multilingual support (10+ languages)</li>
                  </ul>
                </Card>
                <Card className="p-8">
                  <h3 className="text-xl font-bold text-muted-foreground mb-4">Choose PATLive If You:</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Need very low call volume (under 50 min/month)</li>
                    <li>• Prefer human-only service</li>
                    <li>• Only need business hours coverage</li>
                    <li>• Are okay with unpredictable monthly bills</li>
                    <li>• Don't need advanced CRM features</li>
                    <li>• Only serve English/Spanish markets</li>
                  </ul>
                </Card>
              </div>
            </div>
          </section>
          <ComparisonFAQ
            competitorName="PATLive"
            extraFaqs={[
              {
                question: "PATLive's base price is lower — how is AI Agents 3000 a better deal?",
                answer: "PATLive's $61/mo base only includes 50 minutes. At $2.85/min for overages, a business handling 200 minutes/month would pay $488/mo. AI Agents 3000's $99/mo covers unlimited calls — no surprises, no overage math.",
              },
            ]}
          />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VsPATLive;