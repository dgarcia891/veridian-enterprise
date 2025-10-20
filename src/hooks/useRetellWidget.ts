import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useRetellWidget = () => {
  const { toast } = useToast();
  const [isWidgetReady, setIsWidgetReady] = useState(false);

  useEffect(() => {
    const checkWidget = setInterval(() => {
      if (window.RetellWebClient) {
        setIsWidgetReady(true);
        clearInterval(checkWidget);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkWidget);
      if (!window.RetellWebClient) {
        console.error("Retell widget failed to load");
      }
    }, 10000);

    return () => {
      clearInterval(checkWidget);
      clearTimeout(timeout);
    };
  }, []);

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
