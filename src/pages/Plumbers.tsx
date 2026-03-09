import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Check, Phone, Clock, TrendingUp, AlertTriangle, Calendar, Wrench } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Plumbers = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Phone, text: "Captures emergency calls 24/7 - even at 3 AM" },
    { icon: Calendar, text: "Qualifies leads and books estimates automatically" },
    { icon: TrendingUp, text: "Recovers revenue from missed service opportunities" },
    { icon: AlertTriangle, text: "Routes urgent calls to on-call plumber instantly" },
  ];

  const stats = [
    { value: "100%", label: "Call Answer Rate" },
    { value: "24/7", label: "Emergency Ready" },
    { value: "30 sec", label: "Average Response" },
    { value: "Instant", label: "Lead Routing" },
  ];

  const painPoints = [
    {
      problem: "In the middle of a job and can't answer?",
      solution: "AI handles it professionally and books the estimate"
    },
    {
      problem: "After-hours emergency calls?",
      solution: "Captured and routed to on-call crew instantly"
    },
    {
      problem: "Tire kickers wasting your time?",
      solution: "AI pre-qualifies every lead before it reaches you"
    },
    {
      problem: "Losing to competitors who answer first?",
      solution: "Never again - 100% call answer rate"
    },
  ];

  return (
    <>
      <Helmet>
        <title>AI Phone System for Plumbers | AiAgents3000</title>
        <meta 
          name="description" 
          content="Stop losing emergency plumbing jobs to missed calls. Our AI receptionist answers every call 24/7, qualifies leads, and routes urgent calls to on-call crews." 
        />
        <meta name="keywords" content="plumber AI, plumbing phone system, AI phone answering, plumber lead qualification, emergency plumbing calls" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 px-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
            
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="text-center space-y-8">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  PLUMBERS:<br />
                  <span className="text-primary">Missed calls are costing you emergency jobs</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  This AI answers every call & qualifies leads - even when you're under a sink.
                </p>

                <div className="glass-card rounded-3xl p-8 max-w-4xl mx-auto">
                  <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center mb-6">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <Wrench className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Watch how our AI handles plumber calls
                      </p>
                      <Button 
                        size="lg"
                        onClick={() => navigate("/demos/sunset-on-lyons")}
                      >
                        Try Live Demo
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate("/schedule-consultation")}
                >
                  Yes, Show Me How to Capture More Service Calls
                </Button>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-12">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="glass-card rounded-2xl p-6 flex items-center gap-4"
                    >
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

          {/* Social Proof Section */}
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                "Already working for plumbers across the country"
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

          {/* Problem/Solution Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-5xl font-bold">
                    Stop Losing Jobs to Missed Calls
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">On a Job? No Problem</h3>
                        <p className="text-muted-foreground">Your AI receptionist handles all calls while you focus on the work</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">3 AM Emergency?</h3>
                        <p className="text-muted-foreground">AI captures details and routes to on-call crew immediately</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Smart Lead Qualification</h3>
                        <p className="text-muted-foreground">Filters serious prospects from price shoppers - saves you time</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Works With Your Schedule</h3>
                        <p className="text-muted-foreground">Books estimates into your calendar with all job details collected</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-bold mb-6">The Cost of Missed Calls</h3>
                  <div className="space-y-6">
                    <div className="border-l-4 border-destructive pl-4">
                      <p className="text-4xl font-bold text-destructive mb-2">3-5</p>
                      <p className="text-muted-foreground">Average missed calls per day for busy plumbing companies</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-4xl font-bold text-primary mb-2">$450</p>
                      <p className="text-muted-foreground">Average plumbing service call value</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-4xl font-bold text-primary mb-2">$126,000+</p>
                      <p className="text-muted-foreground">Potential annual revenue lost to missed calls</p>
                    </div>
                    <div className="border-l-4 border-destructive pl-4">
                      <p className="text-4xl font-bold text-destructive mb-2">62%</p>
                      <p className="text-muted-foreground">Of callers who don't get through go to a competitor</p>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full mt-8"
                    onClick={() => navigate("/schedule-consultation")}
                  >
                    Calculate Your Lost Revenue
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Pain Points Section */}
          <section className="py-20 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
                Sound Familiar?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {painPoints.map((item, index) => (
                  <div key={index} className="glass-card rounded-3xl p-8">
                    <p className="text-xl font-semibold text-destructive mb-4 italic">
                      "{item.problem}"
                    </p>
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
              <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
                How It Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-card rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Quick Setup</h3>
                  <p className="text-muted-foreground">
                    Tell us about your services, service area, and pricing. 5-minute setup.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Forward Your Calls</h3>
                  <p className="text-muted-foreground">
                    Forward your business line to your AI number. Keep your existing number.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Start Booking</h3>
                  <p className="text-muted-foreground">
                    AI answers instantly, qualifies leads, books estimates, and routes emergencies.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="glass-card rounded-3xl p-12">
                <Clock className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Stop Losing Jobs to Missed Calls
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join plumbers that capture every lead. Get started in minutes.
                </p>
                <Button 
                  size="lg" 
                  className="text-lg px-12 py-6"
                  onClick={() => navigate("/schedule-consultation")}
                >
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

export default Plumbers;
