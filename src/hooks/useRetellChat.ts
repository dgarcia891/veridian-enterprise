import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
}

interface UseRetellChatConfig {
  agentId: string;
}

export const useRetellChat = (config: UseRetellChatConfig) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);

  const startChat = async () => {
    try {
      console.log("Starting Retell chat for agent:", config.agentId);
      setIsLoading(true);

      const { data, error } = await supabase.functions.invoke('create-retell-chat', {
        body: { agentId: config.agentId }
      });

      if (error) throw error;
      if (!data?.chat_id) throw new Error('No chat_id received');

      console.log("Chat session created:", data.chat_id);
      setChatId(data.chat_id);
      setIsChatActive(true);
      setMessages([]);
    } catch (error) {
      console.error("Error starting Retell chat:", error);
      toast({
        title: "Chat Failed",
        description: error instanceof Error ? error.message : "Failed to start chat",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!chatId) {
      toast({
        title: "Error",
        description: "Chat session not started",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Sending message:", content);
      setIsLoading(true);

      // Add user message immediately
      const userMessage: Message = {
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, userMessage]);

      const { data, error } = await supabase.functions.invoke('send-chat-message', {
        body: { chatId, content }
      });

      if (error) throw error;
      if (!data?.messages) throw new Error('No messages received');

      console.log("Received response:", data.messages);

      // Add agent messages
      const agentMessages: Message[] = data.messages
        .filter((msg: any) => msg.role === 'agent')
        .map((msg: any) => ({
          role: 'agent' as const,
          content: msg.content,
          timestamp: msg.created_timestamp,
        }));

      setMessages(prev => [...prev, ...agentMessages]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message Failed",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endChat = () => {
    setChatId(null);
    setIsChatActive(false);
    setMessages([]);
  };

  return {
    messages,
    sendMessage,
    startChat,
    endChat,
    isLoading,
    isChatActive,
  };
};
