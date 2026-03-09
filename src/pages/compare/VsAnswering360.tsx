import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ComparisonTable, { ComparisonFeature } from "@/components/ComparisonTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features: ComparisonFeature[] = [
  { feature: "Monthly Cost", us: "$99/mo unlimited", competitor: "$179/mo base + overages", highlight: true },
  { feature: "24/7 Availability", us: true, competitor: "Limited hours" },
  { feature: "Per-Minute Fees", us: "None", competitor: "$2.99/min", highlight: true },
  { feature: "Setup Time", us: "24-48 hours", competitor: "2-3 weeks" },
  { feature: "AI-Powered", us: true, competitor: false },
  { feature: "CRM Integration", us: "15+ platforms", competitor: "Limited" },
  { feature: "Languages", us: "10+", competitor: "English only" },
  { feature: "Lead Qualification", us: true, competitor: false },
  { feature: "Appointment Scheduling", us: true, competitor: true },
  { feature: "Call Recording", us: true, competitor: true },
  { feature: "Annual Contract Required", us: false, competitor: true },
  { feature: "Predictable Pricing", us: true, competitor: false, highlight: true },
];

const VsAnswering360 = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Agents 3000 vs Answering360 — Price & Feature Comparison 2026",
    description:
      "Compare AI Agents 3000 ($99/mo unlimited) vs Answering360 ($179/mo + $2.99/min overages). See which virtual receptionist service offers better value.",
    url: "https://aiagents3000.com/compare/vs-answering360",
  };

  return (
    <>
      <Helmet>
        <title>AI Agents 3000 vs Answering360 — Save 45%+ on Virtual Receptionists</title>
        <meta
          name="description"
          content="AI Agents 3000 offers unlimited AI receptionist service for $99/mo vs Answering360's $179/mo base + $2.99/min overages. Compare features and save 45%+."
        />
        <link rel="canonical" href="https://aiagents3000.com/compare/vs-answering360" />
        <meta property="og:title" content="AI Agents 3000 vs Answering360 — 45% Savings Comparison" />
        <meta
          property="og:description"
          content="Unlimited AI calls for $99/mo vs human answering service with expensive per-minute overages. See the feature comparison."
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
                AI Agents 3000 vs <span className="text-primary">Answering360</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Unlimited AI receptionist service for $99/mo vs human answering service starting at $179/mo with expensive $2.99/min overages.
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
                Key Differences at a Glance
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center p-8">
                  <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Predictable Pricing</h3>
                  <p className="text-muted-foreground">
                    $99/mo unlimited vs $179/mo base + $2.99/min overages that add up fast
                  </p>
                </Card>
                <Card className="text-center p-8">
                  <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">AI-Powered</h3>
                  <p className="text-muted-foreground">
                    Advanced AI handles calls instantly vs human-only service with limited availability
                  </p>
                </Card>
                <Card className="text-center p-8">
                  <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-3">Fast Setup</h3>
                  <p className="text-muted-foreground">
                    24-48 hour setup vs 2-3 weeks for human receptionist training and onboarding
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
              <ComparisonTable features={features} competitorName="Answering360" />
            </div>
          </section>

          {/* Annual Cost Comparison */}
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Annual Cost Comparison
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 border-primary border-2">
                  <Badge className="bg-primary text-primary-foreground mb-4">Recommended</Badge>
                  <h3 className="text-2xl font-bold mb-2">AI Agents 3000</h3>
                  <div className="text-4xl font-bold text-primary mb-4">$1,188/year</div>
                  <p className="text-muted-foreground mb-6">
                    Unlimited calls, 24/7 availability, no hidden fees or overages
                  </p>
                  <ul className="text-sm space-y-2 mb-6">
                    <li>• Unlimited AI-powered calls</li>
                    <li>• 10+ languages supported</li>
                    <li>• CRM integrations included</li>
                    <li>• Lead qualification & scheduling</li>
                  </ul>
                </Card>
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Answering360</h3>
                  <div className="text-4xl font-bold text-muted-foreground mb-4">$2,148+/year</div>
                  <p className="text-muted-foreground mb-6">
                    Base cost + overages (assuming 100 minutes/month overage)
                  </p>
                  <ul className="text-sm space-y-2 mb-6 text-muted-foreground">
                    <li>• Human receptionist service</li>
                    <li>• Limited availability hours</li>
                    <li>• Per-minute overage fees</li>
                    <li>• 2-3 week setup process</li>
                  </ul>
                </Card>
              </div>
              <div className="text-center mt-8">
                <Button size="lg" onClick={() => navigate("/schedule-consultation")}>
                  Save $960+ Per Year <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VsAnswering360;