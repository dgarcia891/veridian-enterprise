import { Helmet } from "react-helmet";
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
  { feature: "Starting Price", us: "$99/mo", competitor: "£289/mo (~$365)", highlight: true },
  { feature: "24/7 Availability", us: true, competitor: "Typically business-hours focused" },
  { feature: "AI-Powered Conversations", us: true, competitor: "Human receptionists" },
  { feature: "Billing Model", us: "Flat-rate plans", competitor: "Plan-based + add-ons" },
  { feature: "Setup Time", us: "10 minutes", competitor: "Onboarding required" },
  { feature: "Multi-Language Support", us: "10+ languages", competitor: "English-first" },
  { feature: "Lead Qualification", us: true, competitor: true },
  { feature: "Appointment Booking", us: true, competitor: true },
  { feature: "CRM Integration", us: "Pro plan", competitor: "Varies by setup" },
  { feature: "After-hours Coverage", us: "Included (24/7)", competitor: "May be limited/extra" },
  { feature: "Custom AI Training", us: "Pro plan", competitor: "—" },
  { feature: "Contract Required", us: false, competitor: "Varies" },
];

const VsMoneypenny = () => {
  const navigate = useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Agents 3000 vs Moneypenny — AI Receptionist Comparison",
    description:
      "Compare AI Agents 3000 and Moneypenny answering services. See pricing, availability, and which option is best for modern lead capture.",
    url: "https://aiagents3000.com/compare/vs-moneypenny",
  };

  return (
    <>
      <Helmet>
        <title>AI Agents 3000 vs Moneypenny — Pricing & Features 2026</title>
        <meta
          name="description"
          content="Compare AI Agents 3000 vs Moneypenny: $99/mo AI coverage vs £289/mo (~$365) human receptionists, 24/7 availability, multi-language support, and faster setup."
        />
        <link rel="canonical" href="https://aiagents3000.com/compare/vs-moneypenny" />
        <meta property="og:title" content="AI Agents 3000 vs Moneypenny — Which Is Better?" />
        <meta
          property="og:description"
          content="Side-by-side comparison of pricing, coverage, and features for AI Agents 3000 vs Moneypenny."
        />
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
                AI Agents 3000 vs <span className="text-primary">Moneypenny</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                If you want predictable pricing and <strong className="text-foreground">true 24/7 coverage</strong>, AI Agents 3000
                delivers AI call handling from <strong className="text-foreground">$99/month</strong>.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" onClick={() => navigate("/schedule-consultation")}>
                  Try AI Agents 3000 Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/roi-calculator")}
                >
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
                    title: "Lower Monthly Cost",
                    desc: "Start at $99/mo vs £289/mo (~$365) for a human-first answering service model.",
                  },
                  {
                    icon: Clock,
                    title: "24/7 Coverage (Not Just Office Hours)",
                    desc: "Capture leads after-hours, weekends, and holidays without staffing constraints.",
                  },
                  {
                    icon: Globe,
                    title: "Multi-Language Support",
                    desc: "Serve more callers with 10+ languages instead of an English-first experience.",
                  },
                ].map((item, idx) => (
                  <Card key={idx} className="glass-card border-border">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h2 className="text-lg font-bold mb-2">{item.title}</h2>
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
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Feature-by-Feature Comparison</h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                A quick breakdown of the differences between an always-on AI receptionist and a human-first answering service.
              </p>
              <ComparisonTable features={features} competitorName="Moneypenny" />
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
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" /> 24/7 coverage included
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" /> Multi-language support
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" /> Fast setup
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="glass-card border-border">
                  <CardContent className="p-8 text-center">
                    <Badge variant="outline" className="mb-4">
                      Moneypenny
                    </Badge>
                    <p className="text-4xl font-bold mb-2">~$4,380+</p>
                    <p className="text-sm text-muted-foreground mb-4">/year (estimated from ~£289/mo)</p>
                    <ul className="text-left space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-muted-foreground" /> Human receptionist model
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-muted-foreground" /> Coverage may be business-hours focused
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-muted-foreground" /> Add-ons vary by package
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 md:py-24">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Want 24/7 Coverage for Less?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Book a quick demo and we’ll show how AI Agents 3000 captures more leads with always-on call handling.
              </p>
              <Button size="lg" onClick={() => navigate("/schedule-consultation")}
              >
                Schedule Free Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </section>
          <ComparisonFAQ
            competitorName="Moneypenny"
            extraFaqs={[
              {
                question: "Moneypenny has dedicated receptionists — is AI really better?",
                answer: "Dedicated receptionists are great but come at a premium ($365+/mo). AI Agents 3000 provides the same personalized experience — trained on your business — at 73% less cost, with true 24/7 availability and zero wait times.",
              },
            ]}
          />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default VsMoneypenny;
