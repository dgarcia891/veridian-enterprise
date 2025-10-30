import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, X, Volume2 } from "lucide-react";
import { useRetellVoiceWidget } from "@/hooks/useRetellVoiceWidget";

interface RetellVoiceWidgetProps {
  agentId: string;
}

export const RetellVoiceWidget = ({ agentId }: RetellVoiceWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { startCall, endCall, isCallActive, isLoading } = useRetellVoiceWidget({ agentId });

  const handleStartCall = async () => {
    setIsOpen(true);
    await startCall();
  };

  const handleEndCall = () => {
    endCall();
    setIsOpen(false);
  };

  if (!isOpen && !isCallActive) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleStartCall}
          disabled={isLoading}
          className="h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all hover:scale-110"
          aria-label="Start voice call with AI assistant"
        >
          <Phone className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="glass-card p-6 rounded-2xl shadow-2xl w-80 border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${isCallActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            <span className="font-semibold">
              {isCallActive ? 'Call Active' : 'Connecting...'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEndCall}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center gap-4">
          {isCallActive && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Volume2 className="h-5 w-5 animate-pulse" />
              <span>Speaking with Rosie...</span>
            </div>
          )}
          
          <Button
            onClick={handleEndCall}
            variant="destructive"
            className="w-full rounded-full"
          >
            <Phone className="mr-2 h-4 w-4 rotate-135" />
            End Call
          </Button>
        </div>
      </div>
    </div>
  );
};
