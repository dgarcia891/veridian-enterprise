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
      
      // Try to find and click the Retell widget button
      const widgetButton = document.querySelector('[id*="retell"]') as HTMLElement || 
                          document.querySelector('[class*="retell-widget"]') as HTMLElement ||
                          document.querySelector('button[aria-label*="chat"]') as HTMLElement;
      
      if (widgetButton) {
        console.log("Found widget button, clicking...");
        widgetButton.click();
      } else if (window.RetellWebClient) {
        // Fallback to RetellWebClient if available
        console.log("Using RetellWebClient API");
        window.RetellWebClient.open();
      } else {
        console.log("Widget button not found, but marked as ready - user should see widget on page");
        toast({
          title: "Chat Widget",
          description: "Please look for the chat widget button on the page (usually bottom right corner).",
        });
      }
    } catch (error) {
      console.error("Error opening Retell chat:", error);
      toast({
        title: "Connection Error",
        description: "Unable to start chat. Please look for the chat widget button on your screen.",
        variant: "destructive",
      });
    }
  };

  return { isWidgetReady, openChat };
};
