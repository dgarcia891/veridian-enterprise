import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRetellWidget } from "@/hooks/useRetellWidget";
import { useEffect } from "react";

const SunsetOnLyons = () => {
  const { isWidgetReady, openChat } = useRetellWidget();

  useEffect(() => {
    console.log("Retell widget ready:", isWidgetReady);
  }, [isWidgetReady]);

  return (
    <>
      <Helmet>
        <title>Sunset on Lyons AI Demo - Restaurant AI Receptionist | VoiceOwl AI</title>
        <meta 
          name="description" 
          content="Try our AI receptionist demo for Sunset on Lyons restaurant. Experience how AI handles reservations, event inquiries, and customer questions." 
        />
        <meta name="keywords" content="restaurant AI demo, AI receptionist demo, Sunset on Lyons, voice AI restaurant" />
        <link rel="canonical" href="https://voiceowl.ai/demos/sunset-on-lyons" />
        
        <meta property="og:title" content="Sunset on Lyons AI Demo | VoiceOwl AI" />
        <meta property="og:description" content="Experience an AI receptionist for a restaurant. Try our interactive demo." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voiceowl.ai/demos/sunset-on-lyons" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sunset on Lyons AI Demo" />
        <meta name="twitter:description" content="Try our restaurant AI receptionist demo." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-grow">
          {/* Header */}
          <section className="py-8 px-4 border-b">
            <div className="max-w-6xl mx-auto">
              <Button variant="ghost" asChild className="mb-4">
                <Link to="/ai-agent-demos">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Demos
                </Link>
              </Button>
              <h1 className="text-4xl font-bold mb-2">Sunset on Lyons</h1>
              <p className="text-lg text-muted-foreground">
                Restaurant & Event Venue AI Receptionist Demo
              </p>
            </div>
          </section>

          {/* Demo Section */}
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Instructions */}
                <div className="lg:col-span-1">
                  <div className="bg-card border rounded-lg p-6 sticky top-24">
                    <h2 className="text-xl font-semibold mb-4">How to Use This Demo</h2>
                    <ol className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">1.</span>
                        <span>Click the chat widget that appears on the right</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">2.</span>
                        <span>Start speaking or typing your questions</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-semibold text-primary">3.</span>
                        <span>Try asking about reservations, events, menus, or hours</span>
                      </li>
                    </ol>

                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold mb-2">Sample Questions:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• "Do you have availability this Friday?"</li>
                        <li>• "Tell me about your private dining options"</li>
                        <li>• "What's on your dinner menu?"</li>
                        <li>• "Can you host a wedding reception?"</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Widget Container */}
                <div className="lg:col-span-2">
                  <div className="bg-card border rounded-lg p-8 min-h-[600px] flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <MessageCircle className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Talk to Rosie</h3>
                      <p className="text-muted-foreground mb-6">
                        Click the button below to start a conversation with our AI receptionist. 
                        Ask about reservations, events, menus, or any other questions about Sunset on Lyons.
                      </p>
                      <Button 
                        size="lg"
                        onClick={openChat}
                        disabled={!isWidgetReady}
                        className="mb-4"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Start Conversation
                      </Button>
                      <div className="inline-block px-4 py-2 bg-primary/5 rounded-lg text-sm">
                        <span className="text-primary font-semibold">Status:</span> {isWidgetReady ? "Ready to chat" : "Loading..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About This Demo */}
          <section className="py-12 px-4 bg-muted/50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">About This Demo</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Business Type</h3>
                  <p className="text-sm text-muted-foreground">
                    Full-service restaurant and event venue specializing in weddings, corporate events, and fine dining experiences.
                  </p>
                </div>
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">AI Capabilities</h3>
                  <p className="text-sm text-muted-foreground">
                    Handles reservation inquiries, event bookings, menu questions, hours of operation, and general information.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SunsetOnLyons;
