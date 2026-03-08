import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/integrations/supabase/types";

type AnalyticsEvent = Database["public"]["Tables"]["analytics_events"]["Row"];
import {
  ArrowLeft,
  Loader2,
  MousePointerClick,
  FileText,
  Calendar,
  Calculator,
  TrendingUp,
  Users,
  Globe,
  Clock,
  BarChart3,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { AnalyticsToggle } from "@/components/admin/AnalyticsToggle";
import { ConversionFunnel } from "@/components/admin/ConversionFunnel";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface EventCount {
  event_name: string;
  count: number;
}

interface GA4Data {
  configured: boolean;
  error?: string;
  totals?: {
    activeUsers: number;
    sessions: number;
    pageViews: number;
    newUsers: number;
  };
  dailyData?: {
    date: string;
    activeUsers: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    newUsers: number;
  }[];
  topPages?: { path: string; pageViews: number; users: number }[];
  trafficSources?: { source: string; sessions: number; users: number }[];
}

const Analytics = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [isLoading, setIsLoading] = useState(true);
  const [eventCounts, setEventCounts] = useState<EventCount[]>([]);
  const [topPages, setTopPages] = useState<{ path: string; count: number }[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [dateRange, setDateRange] = useState<"today" | "yesterday" | "7d" | "30d" | "all">("today");
  const [ga4Data, setGa4Data] = useState<GA4Data | null>(null);
  const [ga4Loading, setGa4Loading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [rawEvents, setRawEvents] = useState<AnalyticsEvent[]>([]);
  const [ignoreUpdate, setIgnoreUpdate] = useState(0);
  const [activeTab, setActiveTab] = useState("combined");
  const [adminIp, setAdminIp] = useState<string | null>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    const fetchMyIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setAdminIp(data.ip);
      } catch (e) {
        console.error("Failed to fetch admin IP:", e);
      }
    };
    fetchMyIp();
  }, []);

  const getDateFilter = useCallback(() => {
    const now = new Date();
    if (dateRange === "today") {
      now.setHours(0, 0, 0, 0);
    } else if (dateRange === "yesterday") {
      now.setDate(now.getDate() - 1);
      now.setHours(0, 0, 0, 0);
    } else if (dateRange === "7d") {
      now.setDate(now.getDate() - 7);
    } else if (dateRange === "30d") {
      now.setDate(now.getDate() - 30);
    } else {
      return null;
    }
    return now.toISOString();
  }, [dateRange]);

  const getGA4DateRange = useCallback(() => {
    if (dateRange === "today") return { startDate: "today", endDate: "today" };
    if (dateRange === "yesterday") return { startDate: "yesterday", endDate: "yesterday" };
    if (dateRange === "7d") return { startDate: "7daysAgo", endDate: "today" };
    if (dateRange === "30d") return { startDate: "30daysAgo", endDate: "today" };
    return { startDate: "365daysAgo", endDate: "today" };
  }, [dateRange]);

  const fetchGA4Analytics = useCallback(async () => {
    setGa4Loading(true);
    try {
      const { startDate, endDate } = getGA4DateRange();
      const response = await supabase.functions.invoke("fetch-ga4-analytics", {
        body: { startDate, endDate },
      });

      if (response.error) {
        setGa4Data({ configured: false, error: response.error.message });
      } else {
        setGa4Data(response.data);
      }
    } catch (error) {
      console.error("Error fetching GA4 data:", error);
      setGa4Data({ configured: false, error: "Failed to fetch GA4 data" });
    } finally {
      setGa4Loading(false);
    }
  }, [getGA4DateRange]);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const dateFilter = getDateFilter();

      let query = supabase
        .from("analytics_events")
        .select("*");

      if (dateFilter) {
        query = query.gte("created_at", dateFilter);
      }

      const { data: events, error } = await query;

      if (error) throw error;

      if (events) {
        // Filter out my IP if ignored
        const isIgnored = localStorage.getItem("ignore_analytics") === "true";
        let filteredEvents = events;

        if (isIgnored) {
          try {
            const myIp = adminIp || (await fetch('https://api.ipify.org?format=json').then(res => res.json())).ip;
            if (!adminIp) setAdminIp(myIp);
            filteredEvents = events.filter(e => e.ip_address !== myIp);
          } catch (e) {
            console.error("Failed to filter by IP:", e);
          }
        }

        setTotalEvents(filteredEvents.length);
        setRawEvents(filteredEvents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));

        const counts: Record<string, number> = {};
        filteredEvents.forEach((e) => {
          counts[e.event_name] = (counts[e.event_name] || 0) + 1;
        });
        setEventCounts(
          Object.entries(counts)
            .map(([event_name, count]) => ({ event_name, count }))
            .sort((a, b) => b.count - a.count)
        );

        const pageCounts: Record<string, number> = {};
        filteredEvents
          .filter((e) => e.page_path)
          .forEach((e) => {
            pageCounts[e.page_path!] = (pageCounts[e.page_path!] || 0) + 1;
          });
        setTopPages(
          Object.entries(pageCounts)
            .map(([path, count]) => ({ path, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
        );
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getDateFilter, adminIp]);

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
      fetchGA4Analytics();
    }

    // Listen for analytics toggle changes from other components
    const handleStorageChange = () => {
      setIgnoreUpdate(prev => prev + 1);
    };
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener('analytics-ignore-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('analytics-ignore-change', handleStorageChange);
    };
  }, [isAdmin, ignoreUpdate, fetchAnalytics, fetchGA4Analytics]);

  if (adminLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getEventIcon = (eventName: string) => {
    switch (eventName) {
      case "page_view":
        return <Users className="w-4 h-4" />;
      case "cta_click":
        return <MousePointerClick className="w-4 h-4" />;
      case "blog_view":
        return <FileText className="w-4 h-4" />;
      case "consultation_booked":
        return <Calendar className="w-4 h-4" />;
      case "roi_calculator_used":
        return <Calculator className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const formatEventName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const conversions = eventCounts.find((e) => e.event_name === "consultation_booked")?.count || 0;
  const calculatorUses = eventCounts.find((e) => e.event_name === "roi_calculator_used")?.count || 0;
  const blogViews = eventCounts.find((e) => e.event_name === "blog_view")?.count || 0;
  const ctaClicks = eventCounts.find((e) => e.event_name === "cta_click")?.count || 0;
  const formErrors = eventCounts.find((e) => e.event_name === "form_error")?.count || 0;
  const auditCompletions =
    (eventCounts.find((e) => e.event_name === "audit_intent_success")?.count || 0) +
    (eventCounts.find((e) => e.event_name === "audit_step_success")?.count || 0);
  const formSuccesses = eventCounts.find((e) => e.event_name === "form_success")?.count || 0;

  const handleEventSelect = (eventName: string) => {
    const newEvent = selectedEvent === eventName ? null : eventName;
    setSelectedEvent(newEvent);

    // Switch to Custom Events tab and scroll to ledger
    if (newEvent) {
      setActiveTab("custom");
      setTimeout(() => {
        ledgerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blog")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track your key metrics</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={dateRange === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("today")}
            >
              Today
            </Button>
            <Button
              variant={dateRange === "yesterday" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("yesterday")}
            >
              Yesterday
            </Button>
            <Button
              variant={dateRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("7d")}
            >
              7 Days
            </Button>
            <Button
              variant={dateRange === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("30d")}
            >
              30 Days
            </Button>
            <Button
              variant={dateRange === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("all")}
            >
              All Time
            </Button>
            <div className="ml-4">
              <AnalyticsToggle />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="combined">Combined</TabsTrigger>
            <TabsTrigger value="ga4">Google Analytics</TabsTrigger>
            <TabsTrigger value="custom">Custom Events</TabsTrigger>
          </TabsList>

          {/* Combined Tab */}
          <TabsContent value="combined" className="space-y-6">
            {/* GA4 Overview */}
            {ga4Loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : ga4Data?.configured ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Users
                    </CardTitle>
                    <Users className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{ga4Data.totals?.activeUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">from GA4</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Sessions
                    </CardTitle>
                    <Globe className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{ga4Data.totals?.sessions.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">from GA4</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Page Views
                    </CardTitle>
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{ga4Data.totals?.pageViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">from GA4</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      New Users
                    </CardTitle>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{ga4Data.totals?.newUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground mt-1">from GA4</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="w-8 h-8 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center mb-2">
                    GA4 API not configured
                  </p>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    To see Google Analytics data here, you need to set up a service account. Ask me for setup instructions.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Custom Events Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary h-full ${selectedEvent === "consultation_booked" ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => handleEventSelect("consultation_booked")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Consultations Booked
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{conversions}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">conversion events</p>
                    {selectedEvent === "consultation_booked" && <span className="text-[10px] text-primary font-medium animate-pulse">Viewing Logs ↓</span>}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary h-full ${selectedEvent === "roi_calculator_used" ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => handleEventSelect("roi_calculator_used")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    ROI Calculator Uses
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{calculatorUses}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">engagement events</p>
                    {selectedEvent === "roi_calculator_used" && <span className="text-[10px] text-primary font-medium animate-pulse">Viewing Logs ↓</span>}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary h-full ${selectedEvent === "cta_click" ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => handleEventSelect("cta_click")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    CTA Clicks
                  </CardTitle>
                  <MousePointerClick className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{ctaClicks}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">button interactions</p>
                    {selectedEvent === "cta_click" && <span className="text-[10px] text-primary font-medium animate-pulse">Viewing Logs ↓</span>}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary h-full ${selectedEvent === "blog_view" ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => handleEventSelect("blog_view")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Blog Views
                  </CardTitle>
                  <FileText className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{blogViews}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">article reads</p>
                    {selectedEvent === "blog_view" && <span className="text-[10px] text-primary font-medium animate-pulse">Viewing Logs ↓</span>}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Sources & Top Pages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ga4Data?.configured && ga4Data.trafficSources && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Traffic Sources (GA4)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {ga4Data.trafficSources.map((source) => (
                        <div
                          key={source.source}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <span className="font-medium">{source.source || "(direct)"}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{source.users} users</span>
                            <span className="text-lg font-bold">{source.sessions}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPages.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No page data yet.
                      </p>
                    ) : (
                      topPages.map((page, i) => (
                        <div
                          key={page.path}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground text-sm w-5">{i + 1}.</span>
                            <span className="font-medium truncate max-w-[200px]">{page.path}</span>
                          </div>
                          <span className="text-lg font-bold">{page.count}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* GA4 Tab */}
          <TabsContent value="ga4" className="space-y-6">
            {ga4Loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : ga4Data?.configured ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Active Users
                      </CardTitle>
                      <Users className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{ga4Data.totals?.activeUsers.toLocaleString()}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Sessions
                      </CardTitle>
                      <Globe className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{ga4Data.totals?.sessions.toLocaleString()}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Page Views
                      </CardTitle>
                      <BarChart3 className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{ga4Data.totals?.pageViews.toLocaleString()}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        New Users
                      </CardTitle>
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{ga4Data.totals?.newUsers.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Pages from GA4 */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {ga4Data.topPages?.map((page, i) => (
                          <div
                            key={page.path}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground text-sm w-5">{i + 1}.</span>
                              <span className="font-medium truncate max-w-[200px]">{page.path}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">{page.users} users</span>
                              <span className="text-lg font-bold">{page.pageViews}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Traffic Sources */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Traffic Sources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {ga4Data.trafficSources?.map((source) => (
                          <div
                            key={source.source}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <span className="font-medium">{source.source || "(direct)"}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-muted-foreground">{source.users} users</span>
                              <span className="text-lg font-bold">{source.sessions}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Daily Breakdown */}
                {ga4Data.dailyData && ga4Data.dailyData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Daily Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Date</th>
                              <th className="text-right p-2">Users</th>
                              <th className="text-right p-2">Sessions</th>
                              <th className="text-right p-2">Page Views</th>
                              <th className="text-right p-2">Bounce Rate</th>
                              <th className="text-right p-2">Avg. Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ga4Data.dailyData.slice(-10).reverse().map((day) => (
                              <tr key={day.date} className="border-b">
                                <td className="p-2">{day.date}</td>
                                <td className="text-right p-2">{day.activeUsers}</td>
                                <td className="text-right p-2">{day.sessions}</td>
                                <td className="text-right p-2">{day.pageViews}</td>
                                <td className="text-right p-2">{(day.bounceRate * 100).toFixed(1)}%</td>
                                <td className="text-right p-2">{formatDuration(day.avgSessionDuration)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">GA4 API Not Configured</h3>
                  <p className="text-muted-foreground text-center max-w-lg mb-6">
                    To display Google Analytics data directly in this dashboard, you need to set up a service account with the GA4 Data API.
                  </p>
                  <div className="text-sm text-muted-foreground space-y-2 text-left max-w-lg">
                    <p><strong>Setup steps:</strong></p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to Google Cloud Console → APIs & Services</li>
                      <li>Enable the "Google Analytics Data API"</li>
                      <li>Create a Service Account with Viewer role</li>
                      <li>Generate a JSON key for the service account</li>
                      <li>Add the service account email as a Viewer in GA4 Admin → Property Access</li>
                      <li>Ask me to configure the secrets with your credentials</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Custom Events Tab */}
          <TabsContent value="custom" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary h-full ${selectedEvent === "consultation_booked" ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => handleEventSelect("consultation_booked")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Consultations Booked
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{conversions}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">conversion events</p>
                    {selectedEvent === "consultation_booked" && <span className="text-[10px] text-primary font-medium animate-pulse">Viewing Logs ↓</span>}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary h-full ${selectedEvent === "roi_calculator_used" ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => handleEventSelect("roi_calculator_used")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    ROI Calculator Uses
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{calculatorUses}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">engagement events</p>
                    {selectedEvent === "roi_calculator_used" && <span className="text-[10px] text-primary font-medium animate-pulse">Viewing Logs ↓</span>}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary h-full ${selectedEvent === "cta_click" ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => handleEventSelect("cta_click")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    CTA Clicks
                  </CardTitle>
                  <MousePointerClick className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{ctaClicks}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">button interactions</p>
                    {selectedEvent === "cta_click" && <span className="text-[10px] text-primary font-medium animate-pulse">Viewing Logs ↓</span>}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary h-full ${selectedEvent === "blog_view" ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => handleEventSelect("blog_view")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Blog Views
                  </CardTitle>
                  <FileText className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{blogViews}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">article reads</p>
                    {selectedEvent === "blog_view" && <span className="text-[10px] text-primary font-medium animate-pulse">Viewing Logs ↓</span>}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-destructive h-full ${selectedEvent === "form_error" ? "ring-2 ring-destructive bg-destructive/5" : ""}`}
                onClick={() => handleEventSelect("form_error")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Form Errors
                  </CardTitle>
                  <AlertCircle className="w-4 h-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-destructive">{formErrors}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">validation failures</p>
                    {selectedEvent === "form_error" && <span className="text-[10px] text-destructive font-medium animate-pulse">Viewing Logs ↓</span>}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-green-500 h-full ${selectedEvent === "audit_intent_success" ? "ring-2 ring-green-500 bg-green-500/5" : ""}`}
                onClick={() => handleEventSelect("audit_intent_success")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Audit Completions
                  </CardTitle>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">{auditCompletions}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">form submissions</p>
                    {selectedEvent === "audit_intent_success" && <span className="text-[10px] text-green-500 font-medium animate-pulse">Viewing Logs ↓</span>}
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary h-full ${selectedEvent === "form_success" ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onClick={() => handleEventSelect("form_success")}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Form Successes
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formSuccesses}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">valid submissions</p>
                    {selectedEvent === "form_success" && <span className="text-[10px] text-primary font-medium animate-pulse">Viewing Logs ↓</span>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {eventCounts.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No events tracked yet. Events will appear as users interact with your site.
                      </p>
                    ) : (
                      eventCounts.map((event) => (
                        <div
                          key={event.event_name}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            {getEventIcon(event.event_name)}
                            <span className="font-medium">{formatEventName(event.event_name)}</span>
                          </div>
                          <span className="text-lg font-bold">{event.count}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPages.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No page data yet.
                      </p>
                    ) : (
                      topPages.map((page, i) => (
                        <div
                          key={page.path}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground text-sm w-5">{i + 1}.</span>
                            <span className="font-medium truncate max-w-[200px]">{page.path}</span>
                          </div>
                          <span className="text-lg font-bold">{page.count}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center text-muted-foreground space-y-1">
              <p>Total events tracked: <span className="font-semibold text-foreground">{totalEvents}</span></p>
              <p className="text-xs opacity-50">Build: 2026-01-15-v2</p>
            </div>

            {/* Event Ledger */}
            <div ref={ledgerRef}>
              <Card className={`${selectedEvent ? "ring-2 ring-primary bg-primary/5" : ""} transition-all duration-500`}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Event Ledger</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent
                        ? `Showing detailed logs for: ${formatEventName(selectedEvent)}`
                        : "Recent custom events from all users"}
                    </p>
                    <p className="text-[10px] text-primary/70 mt-1 font-medium italic">
                      * Highlighted rows indicate your own activity (detecting: {adminIp || "..."})
                    </p>
                  </div>
                  {selectedEvent && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
                      Clear Filter
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Time</th>
                          <th className="text-left p-2">Event</th>
                          <th className="text-left p-2">IP Address</th>
                          <th className="text-left p-2">Page</th>
                          <th className="text-left p-2">Metadata</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rawEvents
                          .filter(e => !selectedEvent || e.event_name === selectedEvent)
                          .slice(0, 50)
                          .map((event, i) => {
                            const isMyAdmin = adminIp && event.ip_address === adminIp;
                            return (
                              <tr
                                key={i}
                                className={`border-b hover:bg-muted/30 transition-colors ${isMyAdmin ? "bg-primary/10 border-l-4 border-l-primary" : ""
                                  }`}
                              >
                                <td className="p-2 text-muted-foreground whitespace-nowrap">
                                  {new Date(event.created_at).toLocaleString()}
                                </td>
                                <td className="p-2 font-medium">
                                  <div className="flex items-center gap-2">
                                    {getEventIcon(event.event_name)}
                                    <a
                                      href={event.page_path || "/"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:text-primary hover:underline underline-offset-4 cursor-help transition-all flex items-center gap-1"
                                      title={`Click to view page: ${event.page_path}`}
                                    >
                                      {formatEventName(event.event_name)}
                                      <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                                    </a>
                                  </div>
                                </td>
                                <td className="p-2 font-mono text-xs">{event.ip_address || "hidden"}</td>
                                <td className="p-2 truncate max-w-[150px]">{event.page_path}</td>
                                <td className="p-2 text-xs text-muted-foreground">
                                  {JSON.stringify(event.metadata)}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                    {rawEvents.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No events found for this filter.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
