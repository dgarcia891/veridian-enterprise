import { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseRetellVoiceWidgetConfig {
  agentId: string;
}

export const useRetellVoiceWidget = (config: UseRetellVoiceWidgetConfig) => {
  const { toast } = useToast();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const retellClient = useRef<RetellWebClient | null>(null);

  useEffect(() => {
    retellClient.current = new RetellWebClient();

    retellClient.current.on("call_started", () => {
      console.log("Voice call started");
      setIsCallActive(true);
      setIsLoading(false);
    });

    retellClient.current.on("call_ended", () => {
      console.log("Voice call ended");
      setIsCallActive(false);
      toast({
        title: "Call Ended",
        description: "Thanks for chatting with us!",
      });
    });

    retellClient.current.on("error", (error) => {
      console.error("Retell error:", error);
      setIsCallActive(false);
      setIsLoading(false);
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
      console.log("Starting voice call for agent:", config.agentId);
      setIsLoading(true);

      const { data, error } = await supabase.functions.invoke('create-retell-call', {
        body: { agentId: config.agentId }
      });

      if (error) throw error;
      if (!data?.access_token) throw new Error('No access token received');

      console.log("Starting Retell web call with access token");
      await retellClient.current?.startCall({
        accessToken: data.access_token,
      });
    } catch (error) {
      console.error("Error starting voice call:", error);
      setIsLoading(false);
      toast({
        title: "Call Failed",
        description: error instanceof Error ? error.message : "Failed to start call",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    retellClient.current?.stopCall();
    setIsCallActive(false);
  };

  return {
    startCall,
    endCall,
    isCallActive,
    isLoading,
  };
};
