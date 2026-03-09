import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Clock, Globe, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const competitors = [
  {
    name: "Smith.ai",
    slug: "/compare/vs-smith-ai",
    icon: DollarSign,
    tagline: "Human receptionists at $300/mo for 30 calls",
    savings: "Save 67%+",
    ourPrice: "$99/mo",
    theirPrice: "$300/mo",
    keyDiff: "AI-powered 24/7 vs hybrid human + AI with per-call overage fees",
  },
  {
    name: "My AI Front Desk",
    slug: "/compare/vs-my-ai-front-desk",
    icon: Zap,
    tagline: "Basic AI receptionist with limited integrations",
    savings: "More features",
    ourPrice: "$99/mo",
    theirPrice: "$65/mo",
    keyDiff: "Full CRM integration, lead qualification, and 10+ languages vs basic call answering",
  },
  {
    name: "Dialzara",
    slug: "/compare/vs-dialzara",
    icon: Globe,
    tagline: "AI answering service with per-minute billing",
    savings: "No per-minute fees",
    ourPrice: "$99/mo",
    theirPrice: "$29/mo + usage",
    keyDiff: "Predictable flat-rate pricing vs per-minute charges that add up fast",
  },
  {
    name: "Ruby Receptionists",
    slug: "/compare/vs-ruby-receptionists",
    icon: Clock,
    tagline: "Human receptionists at $235/mo for 50 minutes",
    savings: "Save 58%+",
    ourPrice: "$99/mo",
    theirPrice: "$235/mo",
    keyDiff: "24/7 AI coverage vs business-hours-only human receptionists, English only",
  },
  {
    name: "Moneypenny",
    slug: "/compare/vs-moneypenny",
    icon: DollarSign,
    tagline: "UK human receptionists at £289/mo (~$365)",
    savings: "Save 73%+",
    ourPrice: "$99/mo",
    theirPrice: "$365/mo",
    keyDiff: "Always-on AI coverage vs a human-first model with business-hours limitations",
  },
  {
    name: "Answering360",
    slug: "/compare/vs-answering360",
    icon: Clock,
    tagline: "Human answering service at $179/mo with overages",
    savings: "Save 45%+",
    ourPrice: "$99/mo",
    theirPrice: "$179/mo",
    keyDiff: "Unlimited AI calls vs human service with $2.99/min overage fees",
  },
  {
    name: "PATLive",
    slug: "/compare/vs-patlive",
    icon: Zap,
    tagline: "Low base price with high per-minute overages",
    savings: "No overage fees",
    ourPrice: "$99/mo",
    theirPrice: "$61/mo + usage",
    keyDiff: "Predictable unlimited pricing vs escalating costs with $2.85/min overages",
  },
];

const Compare = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Agents 3000 — Competitor Comparisons",
    description:
      "See how AI Agents 3000 compares to Smith.ai, My AI Front Desk, Dialzara, Ruby Receptionists, Moneypenny, Answering360, and PATLive on pricing, features, and value.",
    url: "https://aiagents3000.com/compare",
  };

  return (
    <>
      <Helmet>
        <title>Compare AI Agents 3000 vs Competitors — Pricing & Features 2026</title>
        <meta
          name="description"
          content="Compare AI Agents 3000 to Smith.ai, My AI Front Desk, Dialzara, Ruby Receptionists, and Moneypenny. See pricing, features, and which AI receptionist is right for you."
        />
        <link rel="canonical" href="https://aiagents3000.com/compare" />
        <meta property="og:title" content="AI Agents 3000 — How We Compare to the Competition" />
        <meta
          property="og:description"
          content="Side-by-side comparisons against Smith.ai, My AI Front Desk, Dialzara, Ruby Receptionists, and Moneypenny."
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
                Comparisons
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                How We <span className="text-primary">Stack Up</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                AI Agents 3000 vs the top virtual receptionist services. See the pricing, features, and value — then decide for yourself.
              </p>
            </div>
          </section>

          {/* Competitor Cards */}
          <section className="py-16 md:py-24">
            <div className="max-w-5xl mx-auto px-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {competitors.map((comp) => (
                  <Card
                    key={comp.slug}
                    className="glass-card border-border hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                    onClick={() => navigate(comp.slug)}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <comp.icon className="w-6 h-6" />
                        </div>
                        <Badge className="bg-primary/10 text-primary border-0">{comp.savings}</Badge>
                      </div>

                      <h2 className="text-2xl font-bold mb-2">
                        AI Agents 3000 vs {comp.name}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6">{comp.tagline}</p>

                      <div className="flex gap-4 mb-6">
                        <div className="flex-1 rounded-lg bg-primary/5 p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Us</p>
                          <p className="text-lg font-bold text-primary">{comp.ourPrice}</p>
                        </div>
                        <div className="flex-1 rounded-lg bg-muted/50 p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Them</p>
                          <p className="text-lg font-bold text-muted-foreground">{comp.theirPrice}</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-6">{comp.keyDiff}</p>

                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Full Comparison <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-muted/30">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Still Not Sure?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Book a free demo and we'll show you exactly how AI Agents 3000 fits your business — no pressure, no commitment.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" onClick={() => navigate("/schedule-consultation")}>
                  Schedule Free Demo <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/roi-calculator")}>
                  Calculate Your Savings
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

export default Compare;