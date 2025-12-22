import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Loader2,
  MousePointerClick,
  FileText,
  Calendar,
  Calculator,
  TrendingUp,
  Users,
} from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface EventCount {
  event_name: string;
  count: number;
}

interface DailyCount {
  date: string;
  count: number;
}

const Analytics = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [isLoading, setIsLoading] = useState(true);
  const [eventCounts, setEventCounts] = useState<EventCount[]>([]);
  const [dailyPageViews, setDailyPageViews] = useState<DailyCount[]>([]);
  const [topPages, setTopPages] = useState<{ path: string; count: number }[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "all">("7d");

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
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

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const dateFilter = getDateFilter();

      // Fetch all events for the period
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

        // Count events by name
        const counts: Record<string, number> = {};
        events.forEach((e) => {
          counts[e.event_name] = (counts[e.event_name] || 0) + 1;
        });
        setEventCounts(
          Object.entries(counts)
            .map(([event_name, count]) => ({ event_name, count }))
            .sort((a, b) => b.count - a.count)
        );

        // Count page views by day
        const dailyCounts: Record<string, number> = {};
        events
          .filter((e) => e.event_name === "page_view")
          .forEach((e) => {
            const date = new Date(e.created_at).toLocaleDateString();
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
          });
        setDailyPageViews(
          Object.entries(dailyCounts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );

        // Top pages
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
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          {/* All Events */}
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

          {/* Top Pages */}
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

        {/* Total Events Summary */}
        <div className="mt-6 text-center text-muted-foreground">
          <p>Total events tracked: <span className="font-semibold text-foreground">{totalEvents}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
