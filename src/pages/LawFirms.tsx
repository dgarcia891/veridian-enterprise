import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Check, Phone, Clock, TrendingUp, Shield, Calendar, Scale } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const LawFirms = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Phone, text: "Answers every client call — 24/7/365" },
    { icon: Shield, text: "Screens and qualifies potential clients professionally" },
    { icon: Calendar, text: "Books consultations directly into your calendar" },
    { icon: TrendingUp, text: "Captures leads competitors miss after hours" },
  ];

  const stats = [
    { value: "100%", label: "Call Answer Rate" },
    { value: "24/7", label: "Client Intake" },
    { value: "<1 min", label: "Average Response" },
    { value: "HIPAA", label: "Compliant Ready" },
  ];

  const painPoints = [
    {
      problem: "In court and missing potential client calls?",
      solution: "AI screens and qualifies every caller — you review leads after"
    },
    {
      problem: "After-hours callers going to competing firms?",
      solution: "24/7 intake captures leads when your office is closed"
    },
    {
      problem: "Paralegals spending hours on initial screening?",
      solution: "AI handles intake questions and filters qualified prospects"
    },
    {
      problem: "High-value cases slipping through the cracks?",
      solution: "Priority routing ensures urgent matters reach you immediately"
    },
  ];

  return (
    <>
      <Helmet>
        <title>AI Phone System for Law Firms | AiAgents3000</title>
        <meta
          name="description"
          content="Never miss a potential client call again. Our AI receptionist answers 24/7, screens callers, qualifies leads, and books consultations for law firms of all sizes."
        />
        <meta name="keywords" content="law firm AI receptionist, legal answering service, attorney phone system, law firm lead intake, AI client screening legal" />
        <link rel="canonical" href="https://veridian-enterprise.lovable.app/law-firms" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero */}
          <section className="relative py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="text-center space-y-8">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  LAW FIRMS:<br />
                  <span className="text-primary">Missed calls are costing you high-value cases</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  This AI answers every call, screens clients, and books consultations — even when you're in court.
                </p>

                <div className="glass-card rounded-3xl p-8 max-w-4xl mx-auto">
                  <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center mb-6">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <Scale className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-muted-foreground">See how our AI handles law firm calls</p>
                      <Button size="lg" onClick={() => navigate("/demos/sunset-on-lyons")}>
                        Try Live Demo
                      </Button>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate("/schedule-consultation")}>
                  Yes, Show Me How to Capture More Clients
                </Button>

                <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-12">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="glass-card rounded-2xl p-6 flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-left font-medium">{benefit.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                "Already working for law firms across the country"
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="glass-card rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Problem/Solution */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-5xl font-bold">Stop Losing Clients to Missed Calls</h2>
                  <div className="space-y-4">
                    {[
                      { title: "In Court All Day?", desc: "AI handles every call and sends qualified leads to your inbox" },
                      { title: "After-Hours Intake", desc: "Potential clients call when they're ready — AI captures them 24/7" },
                      { title: "Professional Screening", desc: "Asks practice-area-specific intake questions before booking" },
                      { title: "Priority Case Routing", desc: "Urgent matters flagged and routed to the right attorney immediately" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                          <p className="text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-bold mb-6">The Cost of Missed Calls</h3>
                  <div className="space-y-6">
                    <div className="border-l-4 border-destructive pl-4">
                      <p className="text-4xl font-bold text-destructive mb-2">35%</p>
                      <p className="text-muted-foreground">Of law firm calls go to voicemail during business hours</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-4xl font-bold text-primary mb-2">$3,000</p>
                      <p className="text-muted-foreground">Average value of a new legal client</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-4xl font-bold text-primary mb-2">$315,000+</p>
                      <p className="text-muted-foreground">Potential annual revenue lost to missed intake calls</p>
                    </div>
                    <div className="border-l-4 border-destructive pl-4">
                      <p className="text-4xl font-bold text-destructive mb-2">72%</p>
                      <p className="text-muted-foreground">Of potential clients don't leave a voicemail</p>
                    </div>
                  </div>
                  <Button size="lg" className="w-full mt-8" onClick={() => navigate("/schedule-consultation")}>
                    Calculate Your Lost Revenue
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Pain Points */}
          <section className="py-20 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Sound Familiar?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {painPoints.map((item, index) => (
                  <div key={index} className="glass-card rounded-3xl p-8">
                    <p className="text-xl font-semibold text-destructive mb-4 italic">"{item.problem}"</p>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <p className="text-lg text-muted-foreground">{item.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { step: "1", title: "Quick Setup", desc: "Tell us your practice areas, intake questions, and scheduling preferences. 5-minute setup." },
                  { step: "2", title: "Forward Your Calls", desc: "Forward your office line to your AI number. Keep your existing number." },
                  { step: "3", title: "Start Booking", desc: "AI answers instantly, screens callers, books consultations, and routes urgent cases." },
                ].map((s) => (
                  <div key={s.step} className="glass-card rounded-3xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl font-bold text-primary">{s.step}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                    <p className="text-muted-foreground">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="glass-card rounded-3xl p-12">
                <Clock className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Stop Losing Clients to Missed Calls</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join law firms that capture every potential client. Get started in minutes.
                </p>
                <Button size="lg" className="text-lg px-12 py-6" onClick={() => navigate("/schedule-consultation")}>
                  Book Your Free Demo
                </Button>
                <p className="text-sm text-muted-foreground mt-6">
                  ✓ No credit card required  ✓ 7-day free trial  ✓ Cancel anytime
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LawFirms;
