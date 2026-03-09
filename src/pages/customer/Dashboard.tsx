import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Loader2, Phone, Settings, PhoneCall, LogOut, Plus, Trash2, Save,
  CheckCircle, Clock, AlertTriangle, TrendingUp, BarChart3, PhoneIncoming, Timer, Bell
} from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const VOICES = [
  { value: "professional-female", label: "Professional Female" },
  { value: "professional-male", label: "Professional Male" },
  { value: "friendly-female", label: "Friendly Female" },
  { value: "friendly-male", label: "Friendly Male" },
];

interface CallLog {
  id: string;
  created_at: string;
  caller_number: string | null;
  duration_seconds: number | null;
  status: string | null;
  summary: string | null;
  user_id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState<any>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [liveCallCount, setLiveCallCount] = useState(0);

  // Editable state
  const [businessName, setBusinessName] = useState("");
  const [servicesOffered, setServicesOffered] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [preferredVoice, setPreferredVoice] = useState("professional-female");
  const [voicemailEnabled, setVoicemailEnabled] = useState(true);
  const [businessHours, setBusinessHours] = useState<any>({});
  const [faqEntries, setFaqEntries] = useState<{ question: string; answer: string }[]>([]);

  useEffect(() => {
    let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/customer/login");
        return;
      }
      setUser(session.user);

      // Load onboarding data
      const { data: ob } = await supabase
        .from("customer_onboarding")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (ob) {
        setOnboarding(ob);
        setBusinessName(ob.business_name || "");
        setServicesOffered(ob.services_offered || []);
        setGreetingMessage(ob.greeting_message || "");
        setPreferredVoice(ob.preferred_voice || "professional-female");
        setVoicemailEnabled(ob.voicemail_enabled ?? true);
        setBusinessHours(ob.business_hours || {});
        setFaqEntries(ob.faq_entries as any || []);
      }

      // Load call logs
      const { data: logs } = await supabase
        .from("call_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      setCallLogs((logs as CallLog[]) || []);
      setLoading(false);

      // Subscribe to real-time call log updates
      realtimeChannel = supabase
        .channel('call-logs-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'call_logs',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            const newCall = payload.new as CallLog;
            setCallLogs((prev) => [newCall, ...prev].slice(0, 50));
            setLiveCallCount((c) => c + 1);
            toast({
              title: "📞 New Call Received",
              description: `From ${newCall.caller_number || "Unknown"} — ${newCall.duration_seconds ? `${Math.floor(newCall.duration_seconds / 60)}m ${newCall.duration_seconds % 60}s` : "Just now"}`,
            });
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'call_logs',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            const updated = payload.new as CallLog;
            setCallLogs((prev) =>
              prev.map((log) => (log.id === updated.id ? updated : log))
            );
          }
        )
        .subscribe();
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/customer/login");
    });

    init();

    return () => {
      subscription.unsubscribe();
      if (realtimeChannel) supabase.removeChannel(realtimeChannel);
    };
  }, [navigate, toast]);

  // Analytics calculations
  const stats = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayCalls = callLogs.filter((l) => new Date(l.created_at) >= today);
    const weekCalls = callLogs.filter((l) => new Date(l.created_at) >= weekAgo);
    const monthCalls = callLogs.filter((l) => new Date(l.created_at) >= monthAgo);

    const avgDuration = callLogs.length > 0
      ? Math.round(callLogs.reduce((sum, l) => sum + (l.duration_seconds || 0), 0) / callLogs.length)
      : 0;

    const completedRate = callLogs.length > 0
      ? Math.round((callLogs.filter((l) => l.status === "completed").length / callLogs.length) * 100)
      : 0;

    return {
      todayCount: todayCalls.length,
      weekCount: weekCalls.length,
      monthCount: monthCalls.length,
      totalCount: callLogs.length,
      avgDuration,
      completedRate,
    };
  }, [callLogs]);

  const handleSave = async () => {
    if (!onboarding) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("customer_onboarding")
        .update({
          business_name: businessName,
          services_offered: servicesOffered,
          greeting_message: greetingMessage,
          preferred_voice: preferredVoice,
          voicemail_enabled: voicemailEnabled,
          business_hours: businessHours as any,
          faq_entries: faqEntries as any,
        } as any)
        .eq("id", onboarding.id);

      if (error) throw error;
      toast({ title: "Settings saved", description: "Your agent configuration has been updated." });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/customer/login");
  };

  const addService = () => {
    if (newService.trim() && !servicesOffered.includes(newService.trim())) {
      setServicesOffered([...servicesOffered, newService.trim()]);
      setNewService("");
    }
  };

  const removeService = (s: string) => setServicesOffered(servicesOffered.filter((x) => x !== s));
  const addFaq = () => setFaqEntries([...faqEntries, { question: "", answer: "" }]);
  const removeFaq = (i: number) => setFaqEntries(faqEntries.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, field: "question" | "answer", value: string) => {
    const updated = [...faqEntries];
    updated[i] = { ...updated[i], [field]: value };
    setFaqEntries(updated);
  };
  const updateHours = (day: string, field: string, value: any) => {
    setBusinessHours((prev: any) => ({
      ...prev,
      [day]: { ...(prev[day] || { enabled: false, open: "09:00", close: "17:00" }), [field]: value },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const provStatus = onboarding?.provisioning_status || "pending";
  const phoneNumber = onboarding?.phone_number;
  const s = stats();

  return (
    <>
      <Helmet><title>Dashboard | AI Agents 3000</title></Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <div className="flex items-center gap-3">
                {liveCallCount > 0 && (
                  <Badge variant="default" className="gap-1 animate-pulse">
                    <Bell className="h-3 w-3" /> {liveCallCount} new
                  </Badge>
                )}
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </div>
            </div>

            {/* Live Analytics Widgets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PhoneIncoming className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.todayCount}</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.weekCount}</p>
                    <p className="text-xs text-muted-foreground">This Week</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Timer className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {s.avgDuration > 60 ? `${Math.floor(s.avgDuration / 60)}m ${s.avgDuration % 60}s` : `${s.avgDuration}s`}
                    </p>
                    <p className="text-xs text-muted-foreground">Avg Duration</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.completedRate}%</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="status" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="status" className="gap-2"><Phone className="h-4 w-4" /> Agent Status</TabsTrigger>
                <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> Settings</TabsTrigger>
                <TabsTrigger value="calls" className="gap-2">
                  <PhoneCall className="h-4 w-4" /> Call Logs
                  {liveCallCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {liveCallCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Agent Status */}
              <TabsContent value="status">
                <Card>
                  <CardHeader><CardTitle>Agent Status</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    {!onboarding ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">You haven't set up your AI agent yet.</p>
                        <Button onClick={() => navigate("/onboarding")}>Start Setup</Button>
                      </div>
                    ) : (
                      <>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-lg border border-border p-4 space-y-2">
                            <p className="text-sm text-muted-foreground">Phone Number</p>
                            {phoneNumber ? (
                              <p className="text-xl font-mono font-bold text-primary">{phoneNumber}</p>
                            ) : (
                              <p className="text-muted-foreground italic">Pending provisioning</p>
                            )}
                          </div>
                          <div className="rounded-lg border border-border p-4 space-y-2">
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={provStatus === "ready" ? "default" : provStatus === "failed" ? "destructive" : "secondary"} className="gap-1">
                              {provStatus === "ready" && <CheckCircle className="h-3 w-3" />}
                              {provStatus === "pending" && <Clock className="h-3 w-3" />}
                              {provStatus === "failed" && <AlertTriangle className="h-3 w-3" />}
                              {provStatus.charAt(0).toUpperCase() + provStatus.slice(1)}
                            </Badge>
                          </div>
                          <div className="rounded-lg border border-border p-4 space-y-2">
                            <p className="text-sm text-muted-foreground">Business</p>
                            <p className="font-semibold text-foreground">{businessName || "Not set"}</p>
                          </div>
                          <div className="rounded-lg border border-border p-4 space-y-2">
                            <p className="text-sm text-muted-foreground">Voice</p>
                            <p className="font-semibold text-foreground">{VOICES.find((v) => v.value === preferredVoice)?.label || preferredVoice}</p>
                          </div>
                        </div>

                        {/* Monthly summary */}
                        <Card className="bg-muted/30 border-dashed">
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-sm text-muted-foreground mb-2">30-Day Summary</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-2xl font-bold text-foreground">{s.monthCount}</p>
                                <p className="text-xs text-muted-foreground">Total Calls</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-foreground">
                                  {s.avgDuration > 60 ? `${Math.floor(s.avgDuration / 60)}m` : `${s.avgDuration}s`}
                                </p>
                                <p className="text-xs text-muted-foreground">Avg Duration</p>
                              </div>
                              <div>
                                <p className="text-2xl font-bold text-foreground">{s.completedRate}%</p>
                                <p className="text-xs text-muted-foreground">Success Rate</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings">
                {!onboarding ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground mb-4">Complete onboarding first to configure your agent.</p>
                      <Button onClick={() => navigate("/onboarding")}>Start Setup</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader><CardTitle className="text-lg">Business Profile</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                          <Label>Business Name</Label>
                          <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Services Offered</Label>
                          <div className="flex gap-2">
                            <Input value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="Add a service" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())} />
                            <Button type="button" variant="outline" onClick={addService}>Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {servicesOffered.map((s) => (
                              <Badge key={s} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeService(s)}>
                                {s} <Trash2 className="h-3 w-3" />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle className="text-lg">Business Hours</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        {DAYS.map((day) => {
                          const dh = businessHours[day] || { enabled: false, open: "09:00", close: "17:00" };
                          return (
                            <div key={day} className="flex items-center gap-3">
                              <Switch checked={dh.enabled} onCheckedChange={(v) => updateHours(day, "enabled", v)} />
                              <span className="w-24 text-sm font-medium text-foreground">{day}</span>
                              {dh.enabled && (
                                <>
                                  <Input type="time" className="w-28" value={dh.open} onChange={(e) => updateHours(day, "open", e.target.value)} />
                                  <span className="text-muted-foreground">to</span>
                                  <Input type="time" className="w-28" value={dh.close} onChange={(e) => updateHours(day, "close", e.target.value)} />
                                </>
                              )}
                              {!dh.enabled && <span className="text-sm text-muted-foreground">Closed</span>}
                            </div>
                          );
                        })}
                        <div className="flex items-center gap-3 pt-2">
                          <Switch checked={voicemailEnabled} onCheckedChange={setVoicemailEnabled} />
                          <Label>Enable voicemail for after-hours calls</Label>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle className="text-lg">AI Agent Configuration</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                          <Label>Greeting Message</Label>
                          <Input value={greetingMessage} onChange={(e) => setGreetingMessage(e.target.value)} placeholder="Thank you for calling..." />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Voice</Label>
                          <Select value={preferredVoice} onValueChange={setPreferredVoice}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {VOICES.map((v) => (
                                <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>FAQ Entries</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addFaq}><Plus className="h-3 w-3 mr-1" /> Add</Button>
                          </div>
                          {faqEntries.map((faq, i) => (
                            <div key={i} className="grid gap-2 p-3 rounded-md border border-border">
                              <Input placeholder="Question" value={faq.question} onChange={(e) => updateFaq(i, "question", e.target.value)} />
                              <Input placeholder="Answer" value={faq.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} />
                              <Button type="button" variant="ghost" size="sm" className="justify-self-end text-destructive" onClick={() => removeFaq(i)}>
                                <Trash2 className="h-3 w-3 mr-1" /> Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Button onClick={handleSave} disabled={saving} className="w-full">
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save All Settings
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Call Logs */}
              <TabsContent value="calls">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Calls</CardTitle>
                      <Badge variant="outline" className="gap-1 text-xs">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Live
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {callLogs.length === 0 ? (
                      <div className="text-center py-8">
                        <PhoneCall className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">No calls yet. Once your agent is live, call activity will appear here in real-time.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Caller</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Summary</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {callLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="text-sm">{new Date(log.created_at).toLocaleString()}</TableCell>
                              <TableCell className="font-mono text-sm">{log.caller_number || "Unknown"}</TableCell>
                              <TableCell className="text-sm">
                                {log.duration_seconds ? `${Math.floor(log.duration_seconds / 60)}m ${log.duration_seconds % 60}s` : "—"}
                              </TableCell>
                              <TableCell>
                                <Badge variant={log.status === "completed" ? "default" : "secondary"}>{log.status}</Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                                {log.summary || "—"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
