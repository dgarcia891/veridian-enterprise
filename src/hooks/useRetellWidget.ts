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
      console.log("=== Opening Retell Chat ===");
      console.log("Widget ready:", isWidgetReady);
      
      // Look for any Retell elements
      const allElements = document.querySelectorAll('*');
      console.log("Searching through", allElements.length, "elements");
      
      const retellElements = Array.from(allElements).filter(el => 
        el.id?.toLowerCase().includes('retell') || 
        el.className?.toString().toLowerCase().includes('retell')
      );
      
      console.log("Found Retell elements:", retellElements.length);
      retellElements.forEach((el, i) => {
        console.log(`Element ${i}:`, el.tagName, el.id, el.className);
      });
      
      // Try clicking any retell element
      if (retellElements.length > 0) {
        console.log("Attempting to click first Retell element");
        const element = retellElements[0] as HTMLElement;
        element.click();
        
        // Also try programmatic trigger
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        element.dispatchEvent(event);
        return;
      }
      
      // Try the RetellWebClient API
      if ((window as any).RetellWebClient) {
        console.log("Using RetellWebClient API");
        (window as any).RetellWebClient.open();
        return;
      }
      
      // Try looking for iframe
      const iframes = document.querySelectorAll('iframe');
      console.log("Found iframes:", iframes.length);
      iframes.forEach((iframe, i) => {
        console.log(`Iframe ${i}:`, iframe.src);
      });
      
      console.log("No widget elements found. Check if script loaded correctly.");
      
    } catch (error) {
      console.error("Error opening Retell chat:", error);
    }
  };

  return { isWidgetReady, openChat };
};
