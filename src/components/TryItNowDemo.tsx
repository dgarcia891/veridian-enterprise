import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Play, Mic, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RetellChatInterface } from "@/components/RetellChatInterface";
import { useRetellVoiceWidget, ConnectionStatus } from "@/hooks/useRetellVoiceWidget";
import { supabase } from "@/integrations/supabase/client";

const TryItNowDemo = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState<"none" | "chat" | "voice">("none");
  const { startCall, endCall, isCallActive, isLoading: isVoiceLoading, status } = useRetellVoiceWidget({
    agentId: "agent_2df66bc30b17e2cbf174bf2f3b",
  });

  const handleStartVoice = async () => {
    setActiveDemo("voice");
    await startCall();
  };

  const handleEndVoice = () => {
    endCall();
    setActiveDemo("none");
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Play className="w-4 h-4" />
            Live Interactive Demo
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Try Our AI Receptionist <span className="text-primary">Right Now</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience how Rosie handles calls and chats for real businesses. No signup required.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Voice Call Card */}
          <div className="glass-card rounded-3xl p-8 flex flex-col items-center text-center relative group hover:shadow-xl transition-shadow duration-300">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Phone className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Talk to Rosie</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Have a real voice conversation with our AI receptionist. She'll answer questions, qualify you as a lead, and book appointments.
            </p>

            {activeDemo === "voice" && isCallActive ? (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-green-600">Call Active — Speaking with Rosie</span>
                </div>
                {/* Voice visualizer */}
                <div className="flex items-center justify-center gap-1 h-12">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-primary rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 32 + 8}px`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${0.6 + Math.random() * 0.4}s`,
                      }}
                    />
                  ))}
                </div>
                <Button
                  onClick={handleEndVoice}
                  variant="destructive"
                  size="lg"
                  className="w-full rounded-full"
                >
                  <Phone className="mr-2 h-5 w-5 rotate-[135deg]" />
                  End Call
                </Button>
              </div>
            ) : activeDemo === "voice" && (status === "connecting") ? (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-muted-foreground">Connecting...</span>
                </div>
                <Button
                  onClick={handleEndVoice}
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleStartVoice}
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold group/btn"
                disabled={isVoiceLoading}
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Voice Call
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              Requires microphone access • Free • No signup
            </p>
          </div>

          {/* Chat Card */}
          <div className="glass-card rounded-3xl p-8 flex flex-col items-center text-center relative group hover:shadow-xl transition-shadow duration-300">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Chat with Rosie</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Prefer text? Chat with our AI assistant to learn how we can help your business capture more leads and revenue.
            </p>

            {activeDemo === "chat" ? (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-semibold text-green-600">Chat is open</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Look for the chat window in the bottom-right corner →
                </p>
                <Button
                  onClick={() => setActiveDemo("none")}
                  variant="outline"
                  size="lg"
                  className="w-full rounded-full"
                >
                  Close Prompt
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setActiveDemo("chat")}
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-base font-semibold group/btn border-primary/30 hover:bg-primary/5"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Chat
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              No microphone needed • Free • No signup
            </p>
          </div>
        </div>

        {/* Industry demos link */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Want to see industry-specific demos?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/demos/sunset-on-lyons")} className="text-primary hover:text-primary/80">
              🍽️ Restaurant Demo
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/demos/medical-office")} className="text-primary hover:text-primary/80">
              🏥 Medical Office Demo
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/demos/ai-agent-demos")} className="text-primary hover:text-primary/80">
              View All Demos →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryItNowDemo;
