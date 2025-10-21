import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useRetellWidget = () => {
  const { toast } = useToast();
  const [isWidgetReady, setIsWidgetReady] = useState(false);

  useEffect(() => {
    // Load the Retell widget script dynamically
    const script = document.createElement('script');
    script.src = 'https://dashboard.retellai.com/retell-widget.js';
    script.async = true;
    script.setAttribute('data-public-key', 'public_key_2dfbee8cc6fc84d1f88bf');
    script.setAttribute('data-agent-id', 'agent_2df66bc30b17e2cbf174bf2f3b');
    script.setAttribute('data-title', 'Veridian Chat Agent');
    script.setAttribute('data-bot-name', 'Rosie');
    script.setAttribute('data-show-ai-popup', 'true');
    script.setAttribute('data-show-ai-popup-time', '5');
    script.setAttribute('data-auto-open', 'false');
    
    script.onload = () => {
      console.log("Retell script loaded successfully");
      const checkWidget = setInterval(() => {
        if (window.RetellWebClient) {
          console.log("RetellWebClient is ready");
          setIsWidgetReady(true);
          clearInterval(checkWidget);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkWidget);
        if (!window.RetellWebClient) {
          console.error("Retell widget failed to initialize");
        }
      }, 5000);
    };

    script.onerror = () => {
      console.error("Failed to load Retell script");
      toast({
        title: "Connection Error",
        description: "Unable to load chat widget. Please refresh the page.",
        variant: "destructive",
      });
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [toast]);

  const openChat = () => {
    if (window.RetellWebClient) {
      try {
        window.RetellWebClient.open();
      } catch (error) {
        console.error("Error opening Retell chat:", error);
        toast({
          title: "Connection Error",
          description: "Unable to start chat. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Loading Chat",
        description: "Please wait a moment while we connect...",
      });
    }
  };

  return { isWidgetReady, openChat };
};
