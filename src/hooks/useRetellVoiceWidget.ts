import { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseRetellVoiceWidgetConfig {
  agentId: string;
}

// Explicit Connection States for better UI feedback
export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export const useRetellVoiceWidget = (config: UseRetellVoiceWidgetConfig) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const retellClient = useRef<RetellWebClient | null>(null);

  useEffect(() => {
    retellClient.current = new RetellWebClient();

    retellClient.current.on("call_started", () => {
      console.log("Voice call started");
      setStatus("connected");
    });

    retellClient.current.on("call_ended", () => {
      console.log("Voice call ended");
      setStatus("idle");
      toast({
        title: "Call Ended",
        description: "Thanks for chatting with us!",
      });
    });

    retellClient.current.on("error", (error) => {
      console.error("Retell error:", error);
      setStatus("error");
      toast({
        title: "Call Failed",
        description: error.message || "Failed to connect",
        variant: "destructive",
      });
    });

    return () => {
      if (retellClient.current) {
        retellClient.current.stopCall();
      }
    };
  }, [toast]);

  const startCall = async () => {
    try {
      // 1. Pre-Check Microphone Permissions
      // This is a common failure point that isn't always caught by the SDK early enough
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (micError) {
        console.error("Microphone permission denied:", micError);
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to start the voice call.",
          variant: "destructive",
        });
        return;
      }

      console.log("Starting voice call for agent:", config.agentId);
      setStatus("connecting");

      // 2. Invoke Edge Function with hardened error handling
      const { data, error } = await supabase.functions.invoke('create-retell-call', {
        body: { agentId: config.agentId }
      });

      if (error) {
        throw new Error(`Connection failed: ${error.message}`);
      }

      if (!data?.access_token) {
        throw new Error('Server returned invalid configuration (no token)');
      }

      console.log("Starting Retell web call with access token");
      await retellClient.current?.startCall({
        accessToken: data.access_token,
      });

    } catch (error) {
      console.error("Error starting voice call:", error);
      setStatus("error");
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to establish secure connection",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    retellClient.current?.stopCall();
    setStatus("idle");
  };

  return {
    startCall,
    endCall,
    isCallActive: status === "connected",
    isLoading: status === "connecting",
    status, // Export full status for UI
  };
};
