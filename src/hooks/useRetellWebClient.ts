import { useState, useEffect, useRef } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseRetellWebClientConfig {
  agentId: string;
}

export const useRetellWebClient = (config: UseRetellWebClientConfig) => {
  const { toast } = useToast();
  const [isCallActive, setIsCallActive] = useState(false);
  const retellClientRef = useRef<RetellWebClient | null>(null);

  useEffect(() => {
    // Initialize RetellWebClient
    const client = new RetellWebClient();
    retellClientRef.current = client;

    // Set up event listeners
    client.on("call_started", () => {
      console.log("Retell call started");
      setIsCallActive(true);
    });

    client.on("call_ended", () => {
      console.log("Retell call ended");
      setIsCallActive(false);
    });

    client.on("agent_start_talking", () => {
      console.log("Agent started talking");
    });

    client.on("agent_stop_talking", () => {
      console.log("Agent stopped talking");
    });

    client.on("error", (error) => {
      console.error("Retell error:", error);
      toast({
        title: "Call Error",
        description: "An error occurred during the call",
        variant: "destructive",
      });
      setIsCallActive(false);
    });

    return () => {
      // Cleanup on unmount
      if (retellClientRef.current && isCallActive) {
        retellClientRef.current.stopCall();
      }
    };
  }, []);

  const startCall = async () => {
    try {
      console.log("Starting Retell call for agent:", config.agentId);

      // Call backend to get access token
      const { data, error } = await supabase.functions.invoke('create-retell-call', {
        body: { agentId: config.agentId }
      });

      if (error) throw error;
      if (!data?.access_token) throw new Error('No access token received');

      console.log("Access token received, starting call...");

      // Start the call with the access token
      await retellClientRef.current?.startCall({
        accessToken: data.access_token,
      });

      console.log("Call started successfully");
    } catch (error) {
      console.error("Error starting Retell call:", error);
      toast({
        title: "Call Failed",
        description: error instanceof Error ? error.message : "Failed to start call",
        variant: "destructive",
      });
    }
  };

  const stopCall = () => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
    }
  };

  return { startCall, stopCall, isCallActive };
};
