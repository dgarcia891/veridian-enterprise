import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface RetellWidgetConfig {
  agentId: string;
  title?: string;
  botName?: string;
  showPopup?: boolean;
  popupTime?: number;
}

export const useRetellWidget = (config?: RetellWidgetConfig) => {
  const { toast } = useToast();
  const [isWidgetReady, setIsWidgetReady] = useState(false);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.getElementById('retell-widget');
    
    // Remove existing script if config is provided (for demo pages with custom agent)
    if (existingScript && config?.agentId) {
      console.log("Removing existing Retell widget to load custom agent");
      existingScript.remove();
    }

    // Create and load the Retell widget script
    const script = document.createElement('script');
    script.id = 'retell-widget';
    script.src = 'https://dashboard.retellai.com/retell-widget.js';
    script.setAttribute('data-public-key', 'public_key_2dfbee8cc6fc84d1f88bf');
    script.setAttribute('data-agent-id', config?.agentId || 'agent_2df66bc30b17e2cbf174bf2f3b');
    script.setAttribute('data-title', config?.title || 'AI Agents 3000 Chat Agent');
    script.setAttribute('data-bot-name', config?.botName || 'Rosie');
    script.setAttribute('data-show-ai-popup', config?.showPopup !== false ? 'true' : 'false');
    script.setAttribute('data-show-ai-popup-time', String(config?.popupTime || 5));
    script.setAttribute('data-auto-open', 'false');

    script.onload = () => {
      console.log('Retell widget loaded with agent:', config?.agentId || 'agent_2df66bc30b17e2cbf174bf2f3b');
      // Wait for widget to initialize
      const initCheck = setInterval(() => {
        const widgetButton = document.querySelector('[id*="retell"]') || 
                            document.querySelector('[class*="retell"]');
        
        if (widgetButton) {
          console.log("Retell widget initialized successfully");
          setIsWidgetReady(true);
          clearInterval(initCheck);
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(initCheck);
        if (!isWidgetReady) {
          console.log("Retell widget ready (fallback)");
          setIsWidgetReady(true);
        }
      }, 5000);
    };

    script.onerror = () => {
      console.error("Failed to load Retell widget script");
      toast({
        title: "Error",
        description: "Failed to load chat widget",
        variant: "destructive",
      });
    };

    document.body.appendChild(script);

    return () => {
      // Don't remove script on cleanup to avoid flickering
    };
  }, [config?.agentId, toast, isWidgetReady]);

  const openChat = () => {
    try {
      console.log("Attempting to open Retell chat widget...");
      
      const selectors = [
        '[id*="retell"]',
        '[class*="retell"]',
        'iframe[src*="retell"]',
        'button[aria-label*="chat"]',
        'div[class*="widget"]'
      ];
      
      let widgetElement: HTMLElement | null = null;
      
      for (const selector of selectors) {
        widgetElement = document.querySelector(selector) as HTMLElement;
        if (widgetElement) {
          console.log(`Found widget with selector: ${selector}`);
          break;
        }
      }
      
      if (widgetElement) {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        widgetElement.dispatchEvent(clickEvent);
        
        setTimeout(() => {
          if (widgetElement) widgetElement.click();
        }, 100);
        
        console.log("Widget triggered successfully");
      } else if ((window as any).RetellWebClient) {
        console.log("Using RetellWebClient API");
        (window as any).RetellWebClient.open();
      } else {
        console.log("Please click the chat widget directly in the bottom right corner");
        toast({
          title: "Chat Available",
          description: "Click the chat widget in the bottom right corner to start chatting.",
        });
      }
    } catch (error) {
      console.error("Error opening Retell chat:", error);
      toast({
        title: "Chat Available",
        description: "Click the chat widget in the bottom right corner to connect.",
      });
    }
  };

  return { isWidgetReady, openChat };
};
