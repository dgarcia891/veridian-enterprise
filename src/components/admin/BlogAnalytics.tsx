import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Eye, TrendingUp, Tag } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface TopPost {
  slug: string;
  title: string;
  views: number;
}

interface DailyTrend {
  date: string;
  views: number;
}

interface CategoryData {
  category: string;
  views: number;
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(180 60% 50%)",
  "hsl(220 70% 55%)",
  "hsl(340 65% 55%)",
  "hsl(45 80% 55%)",
  "hsl(270 55% 55%)",
  "hsl(150 50% 45%)",
];

interface BlogAnalyticsProps {
  dateFilter?: string;
}

export const BlogAnalytics = ({ dateFilter }: BlogAnalyticsProps) => {
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [trends, setTrends] = useState<DailyTrend[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogAnalytics = async () => {
      setLoading(true);
      try {
        // Fetch blog_view events
        let query = supabase
          .from("analytics_events")
          .select("metadata, created_at")
          .eq("event_name", "blog_view");

        if (dateFilter) {
          query = query.gte("created_at", dateFilter);
        }

        const { data: events, error } = await query;
        if (error) throw error;

        if (!events || events.length === 0) {
          setTopPosts([]);
          setTrends([]);
          setCategories([]);
          setTotalViews(0);
          setLoading(false);
          return;
        }

        setTotalViews(events.length);

        // Aggregate by slug for top posts
        const slugCounts: Record<string, { title: string; views: number }> = {};
        const dailyCounts: Record<string, number> = {};

        events.forEach((event) => {
          const meta = event.metadata as Record<string, unknown> | null;
          const slug = (meta?.slug as string) || "unknown";
          const title = (meta?.title as string) || slug;

          if (!slugCounts[slug]) {
            slugCounts[slug] = { title, views: 0 };
          }
          slugCounts[slug].views++;

          // Daily trend
          const day = event.created_at.substring(0, 10);
          dailyCounts[day] = (dailyCounts[day] || 0) + 1;
        });

        // Top posts sorted by views
        const sortedPosts = Object.entries(slugCounts)
          .map(([slug, { title, views }]) => ({ slug, title, views }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 10);
        setTopPosts(sortedPosts);

        // Daily trends sorted by date
        const sortedTrends = Object.entries(dailyCounts)
          .map(([date, views]) => ({ date, views }))
          .sort((a, b) => a.date.localeCompare(b.date));
        setTrends(sortedTrends);

        // Fetch blog posts to get categories for the viewed slugs
        const slugs = Object.keys(slugCounts);
        const { data: posts } = await supabase
          .from("blog_posts")
          .select("slug, category")
          .in("slug", slugs);

        const catCounts: Record<string, number> = {};
        (posts || []).forEach((post) => {
          const views = slugCounts[post.slug]?.views || 0;
          catCounts[post.category] = (catCounts[post.category] || 0) + views;
        });

        // Add uncategorized for slugs not found in posts
        const matchedSlugs = new Set((posts || []).map((p) => p.slug));
        let uncategorized = 0;
        slugs.forEach((slug) => {
          if (!matchedSlugs.has(slug)) {
            uncategorized += slugCounts[slug].views;
          }
        });
        if (uncategorized > 0) {
          catCounts["Uncategorized"] = (catCounts["Uncategorized"] || 0) + uncategorized;
        }

        const sortedCategories = Object.entries(catCounts)
          .map(([category, views]) => ({ category, views }))
          .sort((a, b) => b.views - a.views);
        setCategories(sortedCategories);
      } catch (error) {
        console.error("Failed to fetch blog analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAnalytics();
  }, [dateFilter]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (totalViews === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Blog Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No blog views recorded yet for this time period.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary stat */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Blog Views
          </CardTitle>
          <Eye className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            across {topPosts.length} post{topPosts.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* View Trends Over Time */}
      {trends.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-5 h-5 text-primary" />
              Views Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                    tickFormatter={(val) => {
                      const d = new Date(val + "T00:00:00");
                      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    }}
                  />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                    labelFormatter={(val) => {
                      const d = new Date(val + "T00:00:00");
                      return d.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      });
                    }}
                  />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-5 h-5 text-primary" />
              Top Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPosts.map((post, index) => {
                const maxViews = topPosts[0]?.views || 1;
                return (
                  <div key={post.slug} className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-foreground line-clamp-1 flex-1">
                        <span className="text-muted-foreground mr-1.5">{index + 1}.</span>
                        {post.title}
                      </span>
                      <span className="text-sm font-bold text-foreground shrink-0">
                        {post.views}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${(post.views / maxViews) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Tag className="w-5 h-5 text-primary" />
              Views by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        dataKey="views"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                        label={({ category, percent }) =>
                          `${category} (${(percent * 100).toFixed(0)}%)`
                        }
                        labelLine={false}
                      >
                        {categories.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 justify-center">
                  {categories.map((cat, i) => (
                    <div key={cat.category} className="flex items-center gap-1.5 text-xs">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{cat.category}</span>
                      <span className="font-medium text-foreground">{cat.views}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No category data available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
