import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useRetellWidget = () => {
  const { toast } = useToast();
  const [isWidgetReady, setIsWidgetReady] = useState(false);

  useEffect(() => {
    // Check if Retell widget script is already loaded (from index.html)
    const checkWidget = () => {
      const existingScript = document.getElementById('retell-widget');
      if (existingScript) {
        console.log("Retell widget script found, checking for initialization...");
        
        // Wait for widget to initialize
        const initCheck = setInterval(() => {
          // Check if the widget button exists in DOM (Retell creates a button)
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
            setIsWidgetReady(true); // Set to true anyway since script is loaded
          }
        }, 5000);
      } else {
        console.error("Retell widget script not found in page");
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(checkWidget, 500);
  }, [toast, isWidgetReady]);

  const openChat = () => {
    try {
      console.log("Attempting to open Retell chat widget...");
      
      // Try multiple methods to trigger the widget
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
        // Try dispatching proper mouse events instead of just .click()
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        widgetElement.dispatchEvent(clickEvent);
        
        // Also try regular click as backup
        setTimeout(() => {
          if (widgetElement) widgetElement.click();
        }, 100);
        
        console.log("Widget triggered successfully");
      } else if (window.RetellWebClient) {
        console.log("Using RetellWebClient API");
        window.RetellWebClient.open();
      } else {
        console.log("Please click the chat widget directly in the bottom right corner");
        toast({
          title: "Chat Available",
          description: "Click the chat widget in the bottom right corner to start talking with Rosie.",
        });
      }
    } catch (error) {
      console.error("Error opening Retell chat:", error);
      toast({
        title: "Chat Available",
        description: "Click the chat widget in the bottom right corner to connect with Rosie.",
      });
    }
  };

  return { isWidgetReady, openChat };
};
