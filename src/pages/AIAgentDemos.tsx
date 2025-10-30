import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AIAgentDemos = () => {
  const demos = [
    {
      id: "sunset-on-lyons",
      name: "Sunset on Lyons",
      description: "Experience an AI receptionist for a restaurant and event venue. Ask about reservations, events, menus, and availability.",
      industry: "Hospitality",
      slug: "/demos/sunset-on-lyons",
    },
  ];

  return (
    <>
      <Helmet>
        <title>AI Agent Demos - Interactive Voice AI Examples | VoiceOwl AI</title>
        <meta 
          name="description" 
          content="Try our interactive AI agent demos. Experience how voice AI can transform customer service for restaurants, medical offices, and businesses." 
        />
        <meta name="keywords" content="AI agent demo, voice AI demo, AI receptionist demo, conversational AI examples" />
        <link rel="canonical" href="https://voiceowl.ai/ai-agent-demos" />
        
        <meta property="og:title" content="AI Agent Demos - Try Voice AI | VoiceOwl AI" />
        <meta property="og:description" content="Experience interactive AI agent demos. See how voice AI handles real customer interactions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voiceowl.ai/ai-agent-demos" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Agent Demos - Try Voice AI" />
        <meta name="twitter:description" content="Experience interactive AI agent demos for businesses." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Try Our AI Agent Demos
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Experience firsthand how our voice AI agents handle real customer interactions. 
                Click on any demo below to start a conversation.
              </p>
            </div>
          </section>

          {/* Demos Grid */}
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demos.map((demo) => (
                  <Card key={demo.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl">{demo.name}</CardTitle>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {demo.industry}
                        </span>
                      </div>
                      <CardDescription>{demo.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full">
                        <Link to={demo.slug}>
                          Try Demo <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-primary/5">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Build Your Own AI Agent?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                See how VoiceOwl AI can transform your customer service with custom AI agents.
              </p>
              <Button asChild size="lg">
                <Link to="/schedule-consultation">
                  Schedule a Consultation
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AIAgentDemos;
