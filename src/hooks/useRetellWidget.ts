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
      // Wait a moment before loading new script
      setTimeout(() => loadScript(), 500);
    } else if (!existingScript) {
      loadScript();
    } else {
      // Script exists and no custom config - widget should be ready
      setTimeout(() => setIsWidgetReady(true), 2000);
    }

    function loadScript() {
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
        
        // Give widget more time to fully initialize its UI
        setTimeout(() => {
          console.log("Checking for Retell widget UI elements...");
          
          // Look for the actual widget button/iframe, not the script
          const widgetUI = document.querySelector('[class*="retell-widget"]') ||
                           document.querySelector('iframe[src*="retell"]') ||
                           document.querySelector('[id*="retell-"]:not(#retell-widget)');
          
          if (widgetUI) {
            console.log("Retell widget UI found:", widgetUI);
            setIsWidgetReady(true);
          } else {
            console.log("Retell widget UI not found yet, marking as ready anyway");
            setIsWidgetReady(true);
          }
        }, 3000);
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
    }

    return () => {
      // Don't remove script on cleanup to avoid flickering
    };
  }, [config?.agentId, toast]);

  const openChat = () => {
    try {
      console.log("=== Opening Retell Chat ===");
      
      // Look for the widget button (not the script tag!)
      const widgetButton = document.querySelector('[class*="retell-widget"]') as HTMLElement;
      const widgetIframe = document.querySelector('iframe[src*="retell"]') as HTMLElement;
      const widgetContainer = document.querySelector('[id*="retell-"]:not(#retell-widget)') as HTMLElement;
      
      console.log("Widget button:", widgetButton);
      console.log("Widget iframe:", widgetIframe);
      console.log("Widget container:", widgetContainer);
      
      const targetElement = widgetButton || widgetIframe || widgetContainer;
      
      if (targetElement) {
        console.log("Found widget UI element, clicking:", targetElement.tagName, targetElement.className);
        targetElement.click();
        
        // Also try dispatching click event
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        targetElement.dispatchEvent(clickEvent);
        return;
      }
      
      // Try the RetellWebClient API
      if ((window as any).RetellWebClient) {
        console.log("Using RetellWebClient.open()");
        (window as any).RetellWebClient.open();
        return;
      }
      
      // If nothing works, show toast with instruction
      console.log("Could not find widget UI elements");
      toast({
        title: "Chat Widget",
        description: "Look for the chat button in the bottom right corner of your screen.",
      });
      
    } catch (error) {
      console.error("Error opening Retell chat:", error);
      toast({
        title: "Chat Widget",
        description: "Look for the chat button in the bottom right corner.",
      });
    }
  };

  return { isWidgetReady, openChat };
};
