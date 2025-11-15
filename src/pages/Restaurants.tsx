import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Check, Phone, Clock, TrendingUp, Users, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Restaurants = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Phone, text: "Answers every call instantly - 24/7/365" },
    { icon: Calendar, text: "Books tables automatically, even after hours" },
    { icon: TrendingUp, text: "Recovers revenue from missed opportunities" },
    { icon: Clock, text: "Never miss a reservation again" },
  ];

  const stats = [
    { value: "100%", label: "Call Answer Rate" },
    { value: "24/7", label: "Always Available" },
    { value: "30 sec", label: "Average Call Time" },
    { value: "$0", label: "Training Required" },
  ];

  return (
    <>
      <Helmet>
        <title>AI Phone System for Restaurants | AiAgents3000</title>
        <meta 
          name="description" 
          content="Stop losing reservations to missed calls. Our AI receptionist answers every call, books tables automatically, and works 24/7. Perfect for busy restaurants." 
        />
        <meta name="keywords" content="restaurant AI, reservation system, AI phone answering, restaurant automation, table booking" />
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
                  RESTAURANT OWNERS:<br />
                  <span className="text-primary">Missed calls are costing you reservations</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  This AI answers every call & books tables even when you're closed.
                </p>

                <div className="glass-card rounded-3xl p-8 max-w-4xl mx-auto">
                  <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center mb-6">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <Phone className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-muted-foreground">
                        Watch how our AI handles restaurant calls
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
                  onClick={() => navigate("/signup")}
                >
                  Yes, Show Me How to Book More Tables
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
                "Already working in restaurants across the country"
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
                    Stop Losing Tables to Missed Calls
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Busy Kitchen? No Problem</h3>
                        <p className="text-muted-foreground">Your AI receptionist handles all calls while your staff focuses on service</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">After-Hours Bookings</h3>
                        <p className="text-muted-foreground">Capture reservations even when you're closed - 24/7 availability</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Natural Conversations</h3>
                        <p className="text-muted-foreground">Handles menus, dietary requirements, special requests - just like your best staff</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-1">Works With Your System</h3>
                        <p className="text-muted-foreground">Integrates with your existing booking system or works standalone</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-bold mb-6">The Cost of Missed Calls</h3>
                  <div className="space-y-6">
                    <div className="border-l-4 border-destructive pl-4">
                      <p className="text-4xl font-bold text-destructive mb-2">2-5</p>
                      <p className="text-muted-foreground">Average missed calls per day for busy restaurants</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-4xl font-bold text-primary mb-2">$75</p>
                      <p className="text-muted-foreground">Average value per table</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-4xl font-bold text-primary mb-2">$54,750</p>
                      <p className="text-muted-foreground">Potential annual revenue lost</p>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full mt-8"
                    onClick={() => navigate("/signup")}
                  >
                    Calculate Your Lost Revenue
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 px-4 bg-muted/30">
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
                    5-minute setup. Tell us about your restaurant, menu, and booking preferences.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Forward Your Calls</h3>
                  <p className="text-muted-foreground">
                    Forward your restaurant phone to your AI number. Keep your existing number.
                  </p>
                </div>

                <div className="glass-card rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Start Booking</h3>
                  <p className="text-muted-foreground">
                    Your AI answers instantly, books tables, and notifies you of every reservation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-4xl text-center">
              <div className="glass-card rounded-3xl p-12">
                <Users className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  Stop Turning Away Customers
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join restaurants that never miss a reservation. Get started in minutes.
                </p>
                <Button 
                  size="lg" 
                  className="text-lg px-12 py-6"
                  onClick={() => navigate("/signup")}
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

export default Restaurants;
