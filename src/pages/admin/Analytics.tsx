import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "all">("7d");
  const [ga4Data, setGa4Data] = useState<GA4Data | null>(null);
  const [ga4Loading, setGa4Loading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
      fetchGA4Analytics();
    }
  }, [isAdmin, dateRange]);

  const getDateFilter = () => {
    const now = new Date();
    if (dateRange === "7d") {
      now.setDate(now.getDate() - 7);
    } else if (dateRange === "30d") {
      now.setDate(now.getDate() - 30);
    } else {
      return null;
    }
    return now.toISOString();
  };

  const getGA4DateRange = () => {
    if (dateRange === "7d") return { startDate: "7daysAgo", endDate: "today" };
    if (dateRange === "30d") return { startDate: "30daysAgo", endDate: "today" };
    return { startDate: "365daysAgo", endDate: "today" };
  };

  const fetchGA4Analytics = async () => {
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
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const dateFilter = getDateFilter();

      let query = supabase
        .from("analytics_events")
        .select("event_name, event_category, page_path, created_at");

      if (dateFilter) {
        query = query.gte("created_at", dateFilter);
      }

      const { data: events, error } = await query;

      if (error) throw error;

      if (events) {
        setTotalEvents(events.length);

        const counts: Record<string, number> = {};
        events.forEach((e) => {
          counts[e.event_name] = (counts[e.event_name] || 0) + 1;
        });
        setEventCounts(
          Object.entries(counts)
            .map(([event_name, count]) => ({ event_name, count }))
            .sort((a, b) => b.count - a.count)
        );

        const pageCounts: Record<string, number> = {};
        events
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
  };

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

        <Tabs defaultValue="combined" className="space-y-6">
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Consultations Booked
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{conversions}</div>
                  <p className="text-xs text-muted-foreground mt-1">custom events</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    ROI Calculator Uses
                  </CardTitle>
                  <Calculator className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{calculatorUses}</div>
                  <p className="text-xs text-muted-foreground mt-1">custom events</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    CTA Clicks
                  </CardTitle>
                  <MousePointerClick className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{ctaClicks}</div>
                  <p className="text-xs text-muted-foreground mt-1">custom events</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Blog Views
                  </CardTitle>
                  <FileText className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{blogViews}</div>
                  <p className="text-xs text-muted-foreground mt-1">custom events</p>
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Consultations Booked
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{conversions}</div>
                  <p className="text-xs text-muted-foreground mt-1">conversion events</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    ROI Calculator Uses
                  </CardTitle>
                  <Calculator className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{calculatorUses}</div>
                  <p className="text-xs text-muted-foreground mt-1">engagement events</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    CTA Clicks
                  </CardTitle>
                  <MousePointerClick className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{ctaClicks}</div>
                  <p className="text-xs text-muted-foreground mt-1">button interactions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Blog Views
                  </CardTitle>
                  <FileText className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{blogViews}</div>
                  <p className="text-xs text-muted-foreground mt-1">article reads</p>
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

            <div className="text-center text-muted-foreground">
              <p>Total events tracked: <span className="font-semibold text-foreground">{totalEvents}</span></p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
