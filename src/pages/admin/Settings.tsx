import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Save, Send, ChevronDown, CheckCircle2, XCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";

interface SmtpConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  adminNotificationEmail: string;
  enabled: boolean;
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "error";
}

const defaultConfig: SmtpConfig = {
  smtpHost: "",
  smtpPort: 587,
  smtpUsername: "",
  smtpPassword: "",
  fromEmail: "",
  fromName: "",
  adminNotificationEmail: "",
  enabled: true,
};

const Settings = () => {
  const { isAdmin, isLoading: authLoading } = useIsAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [config, setConfig] = useState<SmtpConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsOpen, setLogsOpen] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/admin");
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [...prev, { timestamp: new Date().toLocaleTimeString(), message, type }]);
    setLogsOpen(true);
  };

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_settings" as any)
        .select("setting_value")
        .eq("setting_key", "smtp_config")
        .maybeSingle();
      if (error) throw error;
      if ((data as any)?.setting_value) {
        setConfig({ ...defaultConfig, ...((data as any).setting_value as any) });
      }
    } catch (err) {
      console.error("Error loading SMTP config:", err);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("admin_settings" as any)
        .upsert(
          { setting_key: "smtp_config", setting_value: config as any, updated_at: new Date().toISOString() },
          { onConflict: "setting_key" }
        );
      if (error) throw error;
      toast({ title: "Saved", description: "SMTP configuration updated." });
      addLog("SMTP configuration saved.", "success");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      addLog(`Save failed: ${err.message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    addLog("Saving config & sending test email…");

    try {
      // Save first
      const { error: saveErr } = await supabase
        .from("admin_settings" as any)
        .upsert(
          { setting_key: "smtp_config", setting_value: config as any, updated_at: new Date().toISOString() },
          { onConflict: "setting_key" }
        );
      if (saveErr) throw saveErr;

      const invokePromise = supabase.functions.invoke("notify-admin-email", {
        body: { notificationType: "test" },
      });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out after 15s")), 15000)
      );

      const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;

      if (error) {
        let msg = error.message || "Unknown error";
        if (error.context) {
          try {
            const ctx = await error.context.json();
            msg = ctx.error || msg;
          } catch {}
        }
        throw new Error(msg);
      }

      if (data?.success) {
        addLog("✅ Test email sent successfully!", "success");
        toast({ title: "Success", description: "Test email sent — check your inbox." });
      } else {
        throw new Error(data?.error || "Send failed");
      }
    } catch (err: any) {
      addLog(`❌ ${err.message}`, "error");
      toast({ title: "Test Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsTesting(false);
    }
  };

  const update = (key: keyof SmtpConfig, value: string | number | boolean) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const isImapPort = [993, 995].includes(config.smtpPort);

  if (authLoading || isLoadingConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-24 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Admin Settings</h1>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">SMTP Email Configuration</CardTitle>
            <CardDescription>Configure your SMTP server to send email notifications for new leads, audit submissions, and more.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* SMTP Host */}
            <div className="space-y-1.5">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input id="smtpHost" placeholder="smtp.gmail.com" value={config.smtpHost} onChange={(e) => update("smtpHost", e.target.value)} />
            </div>

            {/* SMTP Port */}
            <div className="space-y-1.5">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input id="smtpPort" type="number" placeholder="587" value={config.smtpPort} onChange={(e) => update("smtpPort", Number(e.target.value))} />
              {isImapPort && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Port {config.smtpPort} is for receiving mail. Use 587 or 465.
                </p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="smtpUsername">SMTP Username</Label>
              <Input id="smtpUsername" placeholder="user@example.com" value={config.smtpUsername} onChange={(e) => update("smtpUsername", e.target.value)} />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <div className="relative">
                <Input
                  id="smtpPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="App password"
                  value={config.smtpPassword}
                  onChange={(e) => update("smtpPassword", e.target.value)}
                />
                <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* From Email / Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input id="fromEmail" placeholder="notifications@yourdomain.com" value={config.fromEmail} onChange={(e) => update("fromEmail", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fromName">From Name</Label>
                <Input id="fromName" placeholder="AI Agents 3000" value={config.fromName} onChange={(e) => update("fromName", e.target.value)} />
              </div>
            </div>

            {/* Admin Notification Email */}
            <div className="space-y-1.5">
              <Label htmlFor="adminNotificationEmail">Admin Notification Email</Label>
              <Input id="adminNotificationEmail" placeholder="admin@yourdomain.com" value={config.adminNotificationEmail} onChange={(e) => update("adminNotificationEmail", e.target.value)} />
            </div>

            {/* Enabled */}
            <div className="flex items-center gap-3 pt-2">
              <Switch id="enabled" checked={config.enabled} onCheckedChange={(v) => update("enabled", v)} />
              <Label htmlFor="enabled">Email notifications enabled</Label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save
              </Button>
              <Button variant="secondary" onClick={handleTest} disabled={isTesting || !config.smtpHost}>
                {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Test Email
              </Button>
            </div>

            {/* Response Log */}
            <Collapsible open={logsOpen} onOpenChange={setLogsOpen} className="pt-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                  <ChevronDown className={`h-4 w-4 transition-transform ${logsOpen ? "rotate-180" : ""}`} />
                  Response Log ({logs.length})
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-border bg-muted/30 p-3 text-sm space-y-1.5">
                  {logs.length === 0 && <p className="text-muted-foreground">No entries yet.</p>}
                  {logs.map((l, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {l.type === "success" ? <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> : l.type === "error" ? <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" /> : <span className="h-4 w-4 mt-0.5 shrink-0" />}
                      <span className="text-muted-foreground">{l.timestamp}</span>
                      <span className="text-foreground">{l.message}</span>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
