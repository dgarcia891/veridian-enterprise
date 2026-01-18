import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAIBlogAssistant, AIBlogAssistantOutput } from "@/hooks/useAIBlogAssistant";
import { Loader2, Sparkles, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIBlogAssistantPanelProps {
    onApply: (data: AIBlogAssistantOutput) => void;
}

export const AIBlogAssistantPanel = ({ onApply }: AIBlogAssistantPanelProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sourceContent, setSourceContent] = useState("");
    const [prompt, setPrompt] = useState("Rewrite this content into an engaging blog post for small business owners. Focus on how AI can solve their problems and improve efficiency.");
    const [sourceUrl, setSourceUrl] = useState("");

    const { generate, isLoading, result, clearResult } = useAIBlogAssistant();

    const handleGenerate = async () => {
        if (!sourceContent || !prompt) return;
        await generate({ sourceContent, prompt, sourceUrl });
    };

    const handleApply = () => {
        if (result) {
            onApply(result);
            setIsOpen(false);
            clearResult();
        }
    };

    return (
        <Card className="border-primary/20 bg-primary/5 mb-8">
            <CardHeader className="cursor-pointer py-4" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                        <CardTitle className="text-lg">AI Blog Assistant</CardTitle>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">BETA</Badge>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
                {!isOpen && (
                    <CardDescription>
                        Pasted an article to transform it into a professional blog post automatically.
                    </CardDescription>
                )}
            </CardHeader>

            {isOpen && (
                <CardContent className="space-y-4 pb-6">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="assistant-source">Source Content / Notes</Label>
                            <Textarea
                                id="assistant-source"
                                placeholder="Paste the source article, transcript, or notes here..."
                                className="min-h-[150px] bg-background"
                                value={sourceContent}
                                onChange={(e) => setSourceContent(e.target.value)}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="assistant-url">Source URL (optional)</Label>
                                <Input
                                    id="assistant-url"
                                    placeholder="https://..."
                                    className="bg-background"
                                    value={sourceUrl}
                                    onChange={(e) => setSourceUrl(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assistant-prompt">Transformation Prompt</Label>
                                <Input
                                    id="assistant-prompt"
                                    placeholder="e.g. Focus on local business benefits"
                                    className="bg-background"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        {result && (
                            <Button variant="ghost" onClick={clearResult} disabled={isLoading}>
                                <X className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        )}
                        <Button onClick={handleGenerate} disabled={isLoading || !sourceContent}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Draft
                                </>
                            )}
                        </Button>
                    </div>

                    {result && (
                        <div className="mt-6 border rounded-lg bg-background p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="font-bold text-primary">Generated Preview</h3>
                                <Badge>{result.suggested_category}</Badge>
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Title</h4>
                                    <p className="font-bold text-lg">{result.title}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Excerpt</h4>
                                    <p className="text-sm italic">{result.excerpt}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Content Snippet</h4>
                                    <div className="prose prose-sm max-w-none text-foreground line-clamp-6">
                                        {result.content.substring(0, 500)}...
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t gap-2">
                                <Button variant="outline" size="sm" onClick={clearResult}>
                                    Discard
                                </Button>
                                <Button size="sm" onClick={handleApply}>
                                    <Check className="w-4 h-4 mr-2" />
                                    Apply to Form
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
};
