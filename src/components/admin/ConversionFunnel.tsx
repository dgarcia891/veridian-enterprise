import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";

interface FunnelStageData {
  stage: string;
  label: string;
  count: number;
  conversionRate: number | null;
}

const STAGE_ORDER = [
  { key: "funnel_page_visit", label: "Page Visit" },
  { key: "funnel_audit_started", label: "Audit Started" },
  { key: "funnel_audit_completed", label: "Audit Completed" },
  { key: "funnel_calendar_opened", label: "Calendar Opened" },
  { key: "funnel_booking_completed", label: "Booking Completed" },
  { key: "funnel_payment_completed", label: "Payment Completed" },
];

interface ConversionFunnelProps {
  dateFilter?: string;
}

export const ConversionFunnel = ({ dateFilter }: ConversionFunnelProps) => {
  const [stages, setStages] = useState<FunnelStageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunnelData = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("analytics_events")
          .select("event_name, metadata")
          .eq("event_category", "conversion_funnel");

        if (dateFilter) {
          query = query.gte("created_at", dateFilter);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Count unique funnel_ids per stage
        const stageCounts: Record<string, Set<string>> = {};
        STAGE_ORDER.forEach(({ key }) => {
          stageCounts[key] = new Set();
        });

        (data || []).forEach((event) => {
          const meta = event.metadata as Record<string, unknown> | null;
          const funnelId = (meta?.funnel_id as string) || (meta?.funnel_email as string) || "unknown";
          if (stageCounts[event.event_name]) {
            stageCounts[event.event_name].add(funnelId);
          }
        });

        const funnelStages: FunnelStageData[] = STAGE_ORDER.map(({ key, label }, index) => {
          const count = stageCounts[key]?.size || 0;
          const prevCount = index > 0 ? (stageCounts[STAGE_ORDER[index - 1].key]?.size || 0) : null;
          const conversionRate = prevCount && prevCount > 0 ? (count / prevCount) * 100 : null;

          return { stage: key, label, count, conversionRate };
        });

        setStages(funnelStages);
      } catch (error) {
        console.error("Failed to fetch funnel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFunnelData();
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

  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Conversion Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        {stages.every((s) => s.count === 0) ? (
          <div className="text-center py-8 text-muted-foreground">
            No funnel data yet. Events will appear as users progress through the conversion flow.
          </div>
        ) : (
          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div key={stage.stage} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stage.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">{stage.count}</span>
                    {stage.conversionRate !== null && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          stage.conversionRate >= 50
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : stage.conversionRate >= 20
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {stage.conversionRate.toFixed(1)}% from prev
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-primary"
                    style={{
                      width: `${Math.max((stage.count / maxCount) * 100, stage.count > 0 ? 2 : 0)}%`,
                      opacity: 1 - index * 0.12,
                    }}
                  />
                </div>
                {index < stages.length - 1 && (
                  <div className="flex justify-center text-muted-foreground text-xs py-0.5">↓</div>
                )}
              </div>
            ))}

            {/* Overall conversion rate */}
            {stages[0].count > 0 && stages[stages.length - 1].count > 0 && (
              <div className="mt-4 pt-4 border-t text-center">
                <span className="text-sm text-muted-foreground">Overall Conversion: </span>
                <span className="font-bold text-primary">
                  {((stages[stages.length - 1].count / stages[0].count) * 100).toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
