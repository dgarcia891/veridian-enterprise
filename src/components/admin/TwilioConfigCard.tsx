import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Save, Wifi, ChevronDown, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  defaultAreaCode: string;
  enabled: boolean;
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "error";
}

const defaultConfig: TwilioConfig = {
  accountSid: "",
  authToken: "",
  defaultAreaCode: "",
  enabled: true,
};

const TwilioConfigCard = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<TwilioConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsOpen, setLogsOpen] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

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
        .eq("setting_key", "twilio_config")
        .maybeSingle();
      if (error) throw error;
      if ((data as any)?.setting_value) {
        setConfig({ ...defaultConfig, ...((data as any).setting_value as any) });
      }
    } catch (err) {
      console.error("Error loading Twilio config:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("admin_settings" as any)
        .upsert(
          { setting_key: "twilio_config", setting_value: config as any, updated_at: new Date().toISOString() },
          { onConflict: "setting_key" }
        );
      if (error) throw error;
      toast({ title: "Saved", description: "Twilio configuration updated." });
      addLog("Twilio configuration saved.", "success");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      addLog(`Save failed: ${err.message}`, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    addLog("Saving config & testing Twilio connection…");
    try {
      // Save first
      const { error: saveErr } = await supabase
        .from("admin_settings" as any)
        .upsert(
          { setting_key: "twilio_config", setting_value: config as any, updated_at: new Date().toISOString() },
          { onConflict: "setting_key" }
        );
      if (saveErr) throw saveErr;

      const { data, error } = await supabase.functions.invoke("test-twilio-connection");
      if (error) throw error;
      if (data?.success) {
        addLog(`✅ Connection successful! Account: ${data.friendlyName || data.accountSid}`, "success");
        toast({ title: "Success", description: "Twilio credentials are valid." });
      } else {
        throw new Error(data?.error || "Connection failed");
      }
    } catch (err: any) {
      addLog(`❌ ${err.message}`, "error");
      toast({ title: "Test Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsTesting(false);
    }
  };

  const update = (key: keyof TwilioConfig, value: string | boolean) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Twilio Configuration</CardTitle>
        <CardDescription>
          Configure your Twilio account to automatically provision phone numbers for new customers during onboarding.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Account SID */}
        <div className="space-y-1.5">
          <Label htmlFor="accountSid">Account SID</Label>
          <Input
            id="accountSid"
            placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={config.accountSid}
            onChange={(e) => update("accountSid", e.target.value)}
          />
        </div>

        {/* Auth Token */}
        <div className="space-y-1.5">
          <Label htmlFor="authToken">Auth Token</Label>
          <div className="relative">
            <Input
              id="authToken"
              type={showToken ? "text" : "password"}
              placeholder="Your Twilio Auth Token"
              value={config.authToken}
              onChange={(e) => update("authToken", e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Default Area Code */}
        <div className="space-y-1.5">
          <Label htmlFor="defaultAreaCode">Default Area Code (optional)</Label>
          <Input
            id="defaultAreaCode"
            placeholder="415"
            maxLength={3}
            value={config.defaultAreaCode}
            onChange={(e) => update("defaultAreaCode", e.target.value.replace(/\D/g, ""))}
          />
          <p className="text-xs text-muted-foreground">
            Preferred area code when purchasing new numbers. Leave blank for any available number.
          </p>
        </div>

        {/* Enabled */}
        <div className="flex items-center gap-3 pt-2">
          <Switch id="twilioEnabled" checked={config.enabled} onCheckedChange={(v) => update("enabled", v)} />
          <Label htmlFor="twilioEnabled">Auto-provisioning enabled</Label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
          <Button variant="secondary" onClick={handleTest} disabled={isTesting || !config.accountSid || !config.authToken}>
            {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wifi className="mr-2 h-4 w-4" />}
            Test Connection
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
                  {l.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  ) : l.type === "error" ? (
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  ) : (
                    <span className="h-4 w-4 mt-0.5 shrink-0" />
                  )}
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
  );
};

export default TwilioConfigCard;
