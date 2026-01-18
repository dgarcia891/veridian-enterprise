import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AIBlogAssistantInput {
    sourceContent: string;
    prompt: string;
    sourceUrl?: string;
}

export interface AIBlogAssistantOutput {
    title: string;
    excerpt: string;
    content: string;
    suggested_category: string;
    read_time: string;
    source_url: string | null;
    seo_title: string;
    meta_description: string;
    seo_keywords: string[];
    faq_schema: Array<{ question: string; answer: string }>;
}

export function useAIBlogAssistant() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AIBlogAssistantOutput | null>(null);
    const { toast } = useToast();

    const generate = async (input: AIBlogAssistantInput) => {
        setIsLoading(true);
        setResult(null);

        try {
            const { data, error } = await supabase.functions.invoke("ai-blog-assistant", {
                body: {
                    source_content: input.sourceContent,
                    prompt: input.prompt,
                    source_url: input.sourceUrl || null,
                },
            });

            if (error) throw error;

            if (data.success) {
                setResult(data.data);
                toast({
                    title: "Blog draft generated",
                    description: "Preview the content below and apply it to the form if it looks good.",
                });
                return data.data;
            } else {
                throw new Error(data.error || "Failed to generate blog draft");
            }
        } catch (err: any) {
            console.error("AI Assistant Error:", err);
            toast({
                variant: "destructive",
                title: "Generation failed",
                description: err.message || "An unexpected error occurred during AI generation.",
            });
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const clearResult = () => setResult(null);

    return {
        generate,
        isLoading,
        result,
        clearResult,
    };
}
