import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Plus,
    Pencil,
    Trash2,
    Rss,
    Bot,
    FileText,
    ListTodo,
    Loader2,
    Settings2,
    ShieldCheck,
    Play,
    SkipForward,
    RefreshCw,
    ExternalLink,
    Workflow,
    Check,
    X,
} from "lucide-react";

// Types
interface RssSource {
    id: string;
    name: string;
    value: {
        url: string;
        category: string;
        // Legacy schedule support, but prefer rules
        schedule?: "hourly" | "daily" | "weekly";
    };
    is_active: boolean;
}

interface LlmSettings {
    id: string;
    value: {
        provider: "lovable" | "openai" | "anthropic";
        model: string;
        api_key: string | null;
    };
}

interface PromptTemplate {
    id: string;
    name: string;
    value: {
        description: string;
        system_prompt: string;
        user_prompt: string;
        word_count: number;
    };
    is_active: boolean;
}

interface AutomationRule {
    id: string;
    name: string; // "TechCrunch Daily Summary"
    value: {
        source_id: string;
        prompt_id: string;
        schedule: "hourly" | "daily" | "weekly";
    };
    is_active: boolean;
}

interface VerificationConfig {
    id: string;
    value: {
        enabled: boolean;
        provider: "lovable" | "openai" | "anthropic";
        model: string;
        prompt: string;
        api_key: string | null;
    };
}

interface QueueItem {
    id: string;
    source_id: string | null;
    source_url: string;
    source_title: string | null;
    status: "pending" | "processing" | "completed" | "failed" | "skipped";
    blog_post_id: string | null;
    error_message: string | null;
    created_at: string;
    processed_at: string | null;
}

const LLM_MODELS = {
    lovable: [
        { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
        { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    ],
    openai: [
        { value: "gpt-4o", label: "GPT-4o" },
        { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
        { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    ],
    anthropic: [
        { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
        { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
    ],
};

const CATEGORIES = [
    "AI Technology",
    "Business Growth",
    "Best Practices",
    "Tutorial",
    "Case Studies",
    "Industry Insights",
];

export function AdminAISettings() {
    const [activeTab, setActiveTab] = useState("rss");
    const [loading, setLoading] = useState(true);

    // RSS Sources state
    const [rssSources, setRssSources] = useState<RssSource[]>([]);
    const [rssDialogOpen, setRssDialogOpen] = useState(false);
    const [editingRss, setEditingRss] = useState<RssSource | null>(null);
    const [rssForm, setRssForm] = useState({
        name: "",
        url: "",
        category: "AI Technology",
    });

    // LLM Settings state
    const [llmSettings, setLlmSettings] = useState<LlmSettings | null>(null);
    const [llmForm, setLlmForm] = useState({
        provider: "lovable" as "lovable" | "openai" | "anthropic",
        model: "google/gemini-2.5-flash",
        api_key: "",
    });

    // Prompt Templates state
    const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
    const [promptDialogOpen, setPromptDialogOpen] = useState(false);
    const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null);
    const [promptForm, setPromptForm] = useState({
        name: "",
        description: "",
        system_prompt: "",
        user_prompt: "",
        word_count: 800,
    });

    // Automation Rules state
    const [rules, setRules] = useState<AutomationRule[]>([]);
    const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
    const [ruleForm, setRuleForm] = useState({
        name: "",
        source_id: "",
        prompt_id: "",
        schedule: "daily" as "hourly" | "daily" | "weekly",
    });

    // Verification Config state
    const [verificationConfig, setVerificationConfig] = useState<VerificationConfig | null>(null);
    const [verificationForm, setVerificationForm] = useState({
        enabled: false,
        provider: "openai" as "lovable" | "openai" | "anthropic",
        model: "gpt-4o",
        prompt: "",
        api_key: "",
    });

    // Queue state
    const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        await Promise.all([
            loadRssSources(),
            loadLlmSettings(),
            loadPromptTemplates(),
            loadRules(),
            loadVerificationConfig(),
            loadQueue(),
        ]);
        setLoading(false);
    };

    // ========== RSS Sources ==========
    const loadRssSources = async () => {
        // @ts-expect-error Types not generated yet
        const { data, error } = await supabase
            .from("ai_blog_config")
            .select("*")
            .eq("config_type", "rss_source")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setRssSources(data as unknown as RssSource[]);
        }
    };

    const handleSaveRss = async () => {
        const configValue = {
            url: rssForm.url,
            category: rssForm.category,
        };

        if (editingRss) {
            // @ts-expect-error Types not generated yet
            const { error } = await supabase
                .from("ai_blog_config")
                .update({ name: rssForm.name, value: configValue })
                .eq("id", editingRss.id);

            if (error) {
                toast.error("Failed to update RSS source");
                return;
            }
            toast.success("RSS source updated");
        } else {
            // @ts-expect-error Types not generated yet
            const { error } = await supabase
                .from("ai_blog_config")
                .insert({
                    config_type: "rss_source",
                    name: rssForm.name,
                    value: configValue,
                    is_active: true,
                });

            if (error) {
                toast.error("Failed to add RSS source");
                return;
            }
            toast.success("RSS source added");
        }

        setRssDialogOpen(false);
        setEditingRss(null);
        setRssForm({ name: "", url: "", category: "AI Technology" });
        loadRssSources();
    };

    const handleDeleteRss = async (id: string) => {
        // @ts-expect-error Types not generated yet
        const { error } = await supabase
            .from("ai_blog_config")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Failed to delete RSS source");
            return;
        }
        toast.success("RSS source deleted");
        loadRssSources();
    };

    const handleToggleRss = async (id: string, isActive: boolean) => {
        // @ts-expect-error Types not generated yet
        const { error } = await supabase
            .from("ai_blog_config")
            .update({ is_active: !isActive })
            .eq("id", id);

        if (!error) {
            loadRssSources();
        }
    };

    // ========== LLM Settings ==========
    const loadLlmSettings = async () => {
        // @ts-expect-error Types not generated yet
        const { data, error } = await supabase
            .from("ai_blog_config")
            .select("*")
            .eq("config_type", "llm_settings")
            .single();

        if (!error && data) {
            const settings = data as unknown as LlmSettings;
            setLlmSettings(settings);
            setLlmForm({
                provider: settings.value.provider,
                model: settings.value.model,
                api_key: settings.value.api_key || "",
            });
        }
    };

    const handleSaveLlm = async () => {
        const configValue = {
            provider: llmForm.provider,
            model: llmForm.model,
            api_key: llmForm.provider !== "lovable" ? llmForm.api_key : null,
        };

        if (llmSettings) {
            // @ts-expect-error Types not generated yet
            const { error } = await supabase
                .from("ai_blog_config")
                .update({ value: configValue })
                .eq("id", llmSettings.id);

            if (error) {
                toast.error("Failed to update LLM settings");
                return;
            }
        } else {
            // @ts-expect-error Types not generated yet
            const { error } = await supabase
                .from("ai_blog_config")
                .insert({
                    config_type: "llm_settings",
                    name: "Default LLM",
                    value: configValue,
                    is_active: true,
                });

            if (error) {
                toast.error("Failed to save LLM settings");
                return;
            }
        }

        toast.success("LLM settings saved");
        loadLlmSettings();
    };

    // ========== Prompt Templates ==========
    const loadPromptTemplates = async () => {
        // @ts-expect-error Types not generated yet
        const { data, error } = await supabase
            .from("ai_blog_config")
            .select("*")
            .eq("config_type", "prompt_template")
            .order("created_at", { ascending: true });

        if (!error && data) {
            setPromptTemplates(data as unknown as PromptTemplate[]);
        }
    };

    const handleSavePrompt = async () => {
        const configValue = {
            description: promptForm.description,
            system_prompt: promptForm.system_prompt,
            user_prompt: promptForm.user_prompt,
            word_count: promptForm.word_count,
        };

        if (editingPrompt) {
            // @ts-expect-error Types not generated yet
            const { error } = await supabase
                .from("ai_blog_config")
                .update({ name: promptForm.name, value: configValue })
                .eq("id", editingPrompt.id);

            if (error) {
                toast.error("Failed to update prompt template");
                return;
            }
            toast.success("Prompt template updated");
        } else {
            // @ts-expect-error Types not generated yet
            const { error } = await supabase
                .from("ai_blog_config")
                .insert({
                    config_type: "prompt_template",
                    name: promptForm.name,
                    value: configValue,
                    is_active: true,
                });

            if (error) {
                toast.error("Failed to add prompt template");
                return;
            }
            toast.success("Prompt template added");
        }

        setPromptDialogOpen(false);
        setEditingPrompt(null);
        setPromptForm({ name: "", description: "", system_prompt: "", user_prompt: "", word_count: 800 });
        loadPromptTemplates();
    };

    const handleDeletePrompt = async (id: string) => {
        // @ts-expect-error Types not generated yet
        const { error } = await supabase
            .from("ai_blog_config")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Failed to delete prompt template");
            return;
        }
        toast.success("Prompt template deleted");
        loadPromptTemplates();
    };

    // ========== Automation Rules ==========
    const loadRules = async () => {
        // @ts-expect-error Types not generated yet
        const { data, error } = await supabase
            .from("ai_blog_config")
            .select("*")
            .eq("config_type", "automation_rule")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setRules(data as unknown as AutomationRule[]);
        }
    };

    const handleSaveRule = async () => {
        const configValue = {
            source_id: ruleForm.source_id,
            prompt_id: ruleForm.prompt_id,
            schedule: ruleForm.schedule,
        };

        if (editingRule) {
            // @ts-expect-error Types not generated yet
            const { error } = await supabase
                .from("ai_blog_config")
                .update({ name: ruleForm.name, value: configValue })
                .eq("id", editingRule.id);

            if (error) {
                toast.error("Failed to update rule");
                return;
            }
            toast.success("Rule updated");
        } else {
            // @ts-expect-error Types not generated yet
            const { error } = await supabase
                .from("ai_blog_config")
                .insert({
                    config_type: "automation_rule",
                    name: ruleForm.name,
                    value: configValue,
                    is_active: true,
                });

            if (error) {
                toast.error("Failed to add rule");
                return;
            }
            toast.success("Rule added");
        }

        setRuleDialogOpen(false);
        setEditingRule(null);
        setRuleForm({ name: "", source_id: "", prompt_id: "", schedule: "daily" });
        loadRules();
    };

    const handleDeleteRule = async (id: string) => {
        // @ts-expect-error Types not generated yet
        const { error } = await supabase
            .from("ai_blog_config")
            .delete()
            .eq("id", id);

        if (error) {
            toast.error("Failed to delete rule");
            return;
        }
        toast.success("Rule deleted");
        loadRules();
    };

    const handleToggleRule = async (id: string, isActive: boolean) => {
        // @ts-expect-error Types not generated yet
        const { error } = await supabase
            .from("ai_blog_config")
            .update({ is_active: !isActive })
            .eq("id", id);

        if (!error) {
            loadRules();
        }
    };

    // ========== Verification Config ==========
    const loadVerificationConfig = async () => {
        // @ts-expect-error Types not generated yet
        const { data, error } = await supabase
            .from("ai_blog_config")
            .select("*")
            .eq("config_type", "verification_config")
            .single();

        if (!error && data) {
            const config = data as unknown as VerificationConfig;
            setVerificationConfig(config);
            setVerificationForm({
                enabled: config.value.enabled,
                provider: config.value.provider,
                model: config.value.model,
                prompt: config.value.prompt,
                api_key: config.value.api_key || "",
            });
        }
    };

    const handleSaveVerification = async () => {
        const configValue = {
            enabled: verificationForm.enabled,
            provider: verificationForm.provider,
            model: verificationForm.model,
            prompt: verificationForm.prompt,
            api_key: verificationForm.provider !== "lovable" ? verificationForm.api_key : null,
        };

        if (verificationConfig) {
            // @ts-expect-error Types not generated yet
            const { error } = await supabase
                .from("ai_blog_config")
                .update({ value: configValue })
                .eq("id", verificationConfig.id);

            if (error) {
                toast.error("Failed to update verification config");
                return;
            }
        } else {
            // @ts-expect-error Types not generated yet
            const { error } = await supabase
                .from("ai_blog_config")
                .insert({
                    config_type: "verification_config",
                    name: "Reviewer LLM",
                    value: configValue,
                    is_active: true,
                });

            if (error) {
                toast.error("Failed to save verification config");
                return;
            }
        }

        toast.success("Verification settings saved");
        loadVerificationConfig();
    };

    // ========== Queue ==========
    const loadQueue = async () => {
        // @ts-expect-error Types not generated yet
        const { data, error } = await supabase
            .from("ai_blog_queue")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);

        if (!error && data) {
            setQueueItems(data as unknown as QueueItem[]);
        }
    };

    const handleGenerateArticle = async (queueId: string) => {
        setProcessingId(queueId);

        try {
            const { error } = await supabase.functions.invoke("generate-article", {
                body: { queue_id: queueId },
            });

            if (error) throw error;
            toast.success("Article generated successfully!");
            loadQueue();
        } catch (err) {
            toast.error("Failed to generate article");
            console.error(err);
        } finally {
            setProcessingId(null);
        }
    };

    const handleSkipItem = async (queueId: string) => {
        // @ts-expect-error Types not generated yet
        const { error } = await supabase
            .from("ai_blog_queue")
            .update({ status: "skipped" })
            .eq("id", queueId);

        if (!error) {
            toast.success("Item skipped");
            loadQueue();
        }
    };

    const handleRetryItem = async (queueId: string) => {
        // @ts-expect-error Types not generated yet
        const { error } = await supabase
            .from("ai_blog_queue")
            .update({ status: "pending", error_message: null })
            .eq("id", queueId);

        if (!error) {
            toast.success("Item queued for retry");
            loadQueue();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6 mb-4">
                    <TabsTrigger value="rss" className="flex items-center gap-2">
                        <Rss className="w-4 h-4" />
                        Preview Sources
                    </TabsTrigger>
                    <TabsTrigger value="rules" className="flex items-center gap-2">
                        <Workflow className="w-4 h-4" />
                        Pipeline Rules
                    </TabsTrigger>
                    <TabsTrigger value="llm" className="flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        Generator
                    </TabsTrigger>
                    <TabsTrigger value="verification" className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Verification
                    </TabsTrigger>
                    <TabsTrigger value="prompts" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Prompts
                    </TabsTrigger>
                    <TabsTrigger value="queue" className="flex items-center gap-2">
                        <ListTodo className="w-4 h-4" />
                        Queue
                    </TabsTrigger>
                </TabsList>

                {/* RSS Sources Tab */}
                <TabsContent value="rss" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">RSS Feed Sources</h3>
                            <p className="text-sm text-muted-foreground">
                                Manage the raw RSS feeds available for your pipeline rules.
                            </p>
                        </div>
                        <Dialog open={rssDialogOpen} onOpenChange={setRssDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => {
                                    setEditingRss(null);
                                    setRssForm({ name: "", url: "", category: "AI Technology" });
                                }}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Source
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingRss ? "Edit RSS Source" : "Add RSS Source"}</DialogTitle>
                                    <DialogDescription>
                                        Configure an RSS feed to pull content from.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rss-name">Name</Label>
                                        <Input
                                            id="rss-name"
                                            value={rssForm.name}
                                            onChange={(e) => setRssForm({ ...rssForm, name: e.target.value })}
                                            placeholder="TechCrunch AI"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rss-url">RSS Feed URL</Label>
                                        <Input
                                            id="rss-url"
                                            value={rssForm.url}
                                            onChange={(e) => setRssForm({ ...rssForm, url: e.target.value })}
                                            placeholder="https://example.com/feed.xml"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rss-category">Default Category</Label>
                                        <Select
                                            value={rssForm.category}
                                            onValueChange={(value) => setRssForm({ ...rssForm, category: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setRssDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSaveRss}>Save</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>URL</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rssSources.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No RSS sources configured. Add one to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rssSources.map((source) => (
                                        <TableRow key={source.id}>
                                            <TableCell className="font-medium">{source.name}</TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                <a href={source.value.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                                    {source.value.url.substring(0, 40)}...
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </TableCell>
                                            <TableCell>{source.value.category}</TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={source.is_active}
                                                    onCheckedChange={() => handleToggleRss(source.id, source.is_active)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditingRss(source);
                                                            setRssForm({
                                                                name: source.name,
                                                                url: source.value.url,
                                                                category: source.value.category,
                                                            });
                                                            setRssDialogOpen(true);
                                                        }}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteRss(source.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* Pipeline Rules Tab */}
                <TabsContent value="rules" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Pipeline Rules</h3>
                            <p className="text-sm text-muted-foreground">
                                Connect RSS sources to prompts with specific schedules.
                            </p>
                        </div>
                        <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => {
                                    setEditingRule(null);
                                    setRuleForm({ name: "", source_id: "", prompt_id: "", schedule: "daily" });
                                }}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Rule
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingRule ? "Edit Rule" : "Add Pipeline Rule"}</DialogTitle>
                                    <DialogDescription>
                                        Define how and when to process content from a source.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rule-name">Rule Name</Label>
                                        <Input
                                            id="rule-name"
                                            value={ruleForm.name}
                                            onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                                            placeholder="Daily Tech Summary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rule-source">RSS Source</Label>
                                        <Select
                                            value={ruleForm.source_id}
                                            onValueChange={(value) => setRuleForm({ ...ruleForm, source_id: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select source..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rssSources.map((source) => (
                                                    <SelectItem key={source.id} value={source.id}>{source.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rule-prompt">Prompt Template</Label>
                                        <Select
                                            value={ruleForm.prompt_id}
                                            onValueChange={(value) => setRuleForm({ ...ruleForm, prompt_id: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select prompt..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {promptTemplates.map((template) => (
                                                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rule-schedule">Schedule</Label>
                                        <Select
                                            value={ruleForm.schedule}
                                            onValueChange={(value: "hourly" | "daily" | "weekly") => setRuleForm({ ...ruleForm, schedule: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hourly">Hourly</SelectItem>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setRuleDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSaveRule}>Save Rule</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rule Name</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Prompt</TableHead>
                                    <TableHead>Schedule</TableHead>
                                    <TableHead>Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rules.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No pipeline rules configured. Add a rule to automate content generation.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rules.map((rule) => {
                                        const source = rssSources.find(s => s.id === rule.value.source_id);
                                        const prompt = promptTemplates.find(p => p.id === rule.value.prompt_id);
                                        return (
                                            <TableRow key={rule.id}>
                                                <TableCell className="font-medium">{rule.name}</TableCell>
                                                <TableCell>{source?.name || "Unknown Source"}</TableCell>
                                                <TableCell>{prompt?.name || "Unknown Prompt"}</TableCell>
                                                <TableCell className="capitalize">{rule.value.schedule}</TableCell>
                                                <TableCell>
                                                    <Switch
                                                        checked={rule.is_active}
                                                        onCheckedChange={() => handleToggleRule(rule.id, rule.is_active)}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setEditingRule(rule);
                                                                setRuleForm({
                                                                    name: rule.name,
                                                                    source_id: rule.value.source_id,
                                                                    prompt_id: rule.value.prompt_id,
                                                                    schedule: rule.value.schedule,
                                                                });
                                                                setRuleDialogOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteRule(rule.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* LLM Settings Tab */}
                <TabsContent value="llm" className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold">Generator Configuration</h3>
                        <p className="text-sm text-muted-foreground">
                            Select the primary AI model used to write the rough drafts.
                        </p>
                    </div>

                    <Card>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="llm-provider">Provider</Label>
                                <Select
                                    value={llmForm.provider}
                                    onValueChange={(value: "lovable" | "openai" | "anthropic") => {
                                        setLlmForm({
                                            ...llmForm,
                                            provider: value,
                                            model: LLM_MODELS[value][0].value,
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lovable">Lovable AI (Built-in)</SelectItem>
                                        <SelectItem value="openai">OpenAI</SelectItem>
                                        <SelectItem value="anthropic">Anthropic</SelectItem>
                                    </SelectContent>
                                </Select>
                                {llmForm.provider === "lovable" && (
                                    <p className="text-xs text-green-600">✓ Uses your existing Lovable credits. No API key needed.</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="llm-model">Model</Label>
                                <Select
                                    value={llmForm.model}
                                    onValueChange={(value) => setLlmForm({ ...llmForm, model: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LLM_MODELS[llmForm.provider].map((model) => (
                                            <SelectItem key={model.value} value={model.value}>
                                                {model.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {llmForm.provider !== "lovable" && (
                                <div className="space-y-2">
                                    <Label htmlFor="llm-api-key">API Key</Label>
                                    <Input
                                        id="llm-api-key"
                                        type="password"
                                        value={llmForm.api_key}
                                        onChange={(e) => setLlmForm({ ...llmForm, api_key: e.target.value })}
                                        placeholder={llmForm.provider === "openai" ? "sk-..." : "sk-ant-..."}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Your API key is stored securely and used only for article generation.
                                    </p>
                                </div>
                            )}

                            <Button onClick={handleSaveLlm}>Save Settings</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Verification Tab */}
                <TabsContent value="verification" className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold">LLM Verification (Reviewer)</h3>
                        <p className="text-sm text-muted-foreground">
                            Configure a second AI agent to review and critique drafts before they are finalized.
                        </p>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-base font-medium">
                                Enable Verification Step
                            </CardTitle>
                            <Switch
                                checked={verificationForm.enabled}
                                onCheckedChange={(checked) => setVerificationForm({ ...verificationForm, enabled: checked })}
                            />
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {verificationForm.enabled ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="ver-provider">Reviewer Provider</Label>
                                            <Select
                                                value={verificationForm.provider}
                                                onValueChange={(value: "lovable" | "openai" | "anthropic") => {
                                                    setVerificationForm({
                                                        ...verificationForm,
                                                        provider: value,
                                                        model: LLM_MODELS[value][0].value,
                                                    });
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="openai">OpenAI</SelectItem>
                                                    <SelectItem value="anthropic">Anthropic</SelectItem>
                                                    <SelectItem value="lovable">Lovable AI</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ver-model">Reviewer Model</Label>
                                            <Select
                                                value={verificationForm.model}
                                                onValueChange={(value) => setVerificationForm({ ...verificationForm, model: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {LLM_MODELS[verificationForm.provider].map((model) => (
                                                        <SelectItem key={model.value} value={model.value}>
                                                            {model.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {verificationForm.provider !== "lovable" && (
                                        <div className="space-y-2">
                                            <Label htmlFor="ver-api-key">API Key (if different)</Label>
                                            <Input
                                                id="ver-api-key"
                                                type="password"
                                                value={verificationForm.api_key}
                                                onChange={(e) => setVerificationForm({ ...verificationForm, api_key: e.target.value })}
                                                placeholder="Leave blank to use Generator key if same provider"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="ver-prompt">Reviewer Instructions</Label>
                                        <Textarea
                                            id="ver-prompt"
                                            value={verificationForm.prompt}
                                            onChange={(e) => setVerificationForm({ ...verificationForm, prompt: e.target.value })}
                                            placeholder="You are a senior editor. Review the article for clarity, tone, and accuracy..."
                                            rows={6}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Verification is currently disabled. Enable it to have a second AI review your drafts.
                                </div>
                            )}

                            <Button onClick={handleSaveVerification}>Save Verification Config</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Prompt Templates Tab */}
                <TabsContent value="prompts" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Prompt Templates</h3>
                            <p className="text-sm text-muted-foreground">
                                Customize prompts for different article types.
                            </p>
                        </div>
                        <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => {
                                    setEditingPrompt(null);
                                    setPromptForm({ name: "", description: "", system_prompt: "", user_prompt: "", word_count: 800 });
                                }}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Template
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>{editingPrompt ? "Edit Template" : "Add Template"}</DialogTitle>
                                    <DialogDescription>
                                        Configure a prompt template for article generation.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="prompt-name">Template Name</Label>
                                            <Input
                                                id="prompt-name"
                                                value={promptForm.name}
                                                onChange={(e) => setPromptForm({ ...promptForm, name: e.target.value })}
                                                placeholder="News Summary"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="prompt-words">Target Word Count</Label>
                                            <Input
                                                id="prompt-words"
                                                type="number"
                                                value={promptForm.word_count}
                                                onChange={(e) => setPromptForm({ ...promptForm, word_count: parseInt(e.target.value) || 800 })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="prompt-desc">Description</Label>
                                        <Input
                                            id="prompt-desc"
                                            value={promptForm.description}
                                            onChange={(e) => setPromptForm({ ...promptForm, description: e.target.value })}
                                            placeholder="Rewrite news articles in brand voice"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="prompt-system">System Prompt</Label>
                                        <Textarea
                                            id="prompt-system"
                                            value={promptForm.system_prompt}
                                            onChange={(e) => setPromptForm({ ...promptForm, system_prompt: e.target.value })}
                                            placeholder="You are a professional blog writer..."
                                            rows={4}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="prompt-user">User Prompt</Label>
                                        <Textarea
                                            id="prompt-user"
                                            value={promptForm.user_prompt}
                                            onChange={(e) => setPromptForm({ ...promptForm, user_prompt: e.target.value })}
                                            placeholder="Write about {{source_title}}..."
                                            rows={6}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Available placeholders: {"{{source_title}}"}, {"{{source_content}}"}, {"{{source_url}}"}, {"{{target_word_count}}"}, {"{{category}}"}, {"{{company_name}}"}
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setPromptDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSavePrompt}>Save</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4">
                        {promptTemplates.length === 0 ? (
                            <Card>
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No prompt templates configured. Add one to get started.
                                </CardContent>
                            </Card>
                        ) : (
                            promptTemplates.map((template) => (
                                <Card key={template.id}>
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                        <div>
                                            <CardTitle className="text-base">{template.name}</CardTitle>
                                            <CardDescription>{template.value.description}</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setEditingPrompt(template);
                                                    setPromptForm({
                                                        name: template.name,
                                                        description: template.value.description,
                                                        system_prompt: template.value.system_prompt,
                                                        user_prompt: template.value.user_prompt,
                                                        word_count: template.value.word_count,
                                                    });
                                                    setPromptDialogOpen(true);
                                                }}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeletePrompt(template.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                {template.value.word_count} words
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {template.is_active ? (
                                                    <span className="flex items-center gap-1 text-green-600">
                                                        <Check className="w-3 h-3" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-muted-foreground">
                                                        <X className="w-3 h-3" /> Inactive
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* Queue Tab */}
                <TabsContent value="queue" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Generation Queue</h3>
                            <p className="text-sm text-muted-foreground">
                                Monitor and manage pending article generations.
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={loadQueue}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Source / Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {queueItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            Queue is empty.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    queueItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium line-clamp-1">
                                                        {item.source_title || "Untitled"}
                                                    </span>
                                                    <a
                                                        href={item.source_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-muted-foreground hover:underline truncate max-w-[300px]"
                                                    >
                                                        {item.source_url}
                                                    </a>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        item.status === "completed"
                                                            ? "default"
                                                            : item.status === "failed"
                                                                ? "destructive"
                                                                : item.status === "processing"
                                                                    ? "secondary"
                                                                    : "outline"
                                                    }
                                                >
                                                    {item.status === "processing" && (
                                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                    )}
                                                    {item.status}
                                                </Badge>
                                                {item.error_message && (
                                                    <p className="text-xs text-destructive mt-1 max-w-[200px] truncate" title={item.error_message}>
                                                        {item.error_message}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {item.status === "pending" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleGenerateArticle(item.id)}
                                                                disabled={!!processingId}
                                                            >
                                                                <Play className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleSkipItem(item.id)}
                                                            >
                                                                <SkipForward className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    {item.status === "failed" && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRetryItem(item.id)}
                                                        >
                                                            <RefreshCw className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {item.status === "completed" && item.blog_post_id && (
                                                        <Button size="sm" variant="outline" asChild>
                                                            <a href={`/blog/${item.blog_post_id}`} target="_blank" rel="noopener noreferrer">
                                                                View
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
