import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2, TrendingDown, ArrowRight } from "lucide-react";

interface DropOffData {
  fromLabel: string;
  toLabel: string;
  fromCount: number;
  toCount: number;
  dropOff: number;
  dropOffPercent: number;
  retained: number;
  retainedPercent: number;
}

const STAGE_ORDER = [
  { key: "funnel_blog_visit", label: "Blog Visit" },
  { key: "funnel_page_visit", label: "Page Visit" },
  { key: "funnel_audit_started", label: "Audit Started" },
  { key: "funnel_audit_completed", label: "Audit Completed" },
  { key: "funnel_calendar_opened", label: "Calendar Opened" },
  { key: "funnel_booking_completed", label: "Booking Completed" },
  { key: "funnel_payment_completed", label: "Payment Completed" },
];

interface FunnelDropOffAnalysisProps {
  dateFilter?: string;
}

export const FunnelDropOffAnalysis = ({ dateFilter }: FunnelDropOffAnalysisProps) => {
  const [dropOffs, setDropOffs] = useState<DropOffData[]>([]);
  const [loading, setLoading] = useState(true);
  const [worstStep, setWorstStep] = useState<DropOffData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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

        const results: DropOffData[] = [];
        let worst: DropOffData | null = null;

        for (let i = 0; i < STAGE_ORDER.length - 1; i++) {
          const fromCount = stageCounts[STAGE_ORDER[i].key]?.size || 0;
          const toCount = stageCounts[STAGE_ORDER[i + 1].key]?.size || 0;
          const dropOff = Math.max(fromCount - toCount, 0);
          const dropOffPercent = fromCount > 0 ? (dropOff / fromCount) * 100 : 0;
          const retainedPercent = fromCount > 0 ? (toCount / fromCount) * 100 : 0;

          const item: DropOffData = {
            fromLabel: STAGE_ORDER[i].label,
            toLabel: STAGE_ORDER[i + 1].label,
            fromCount,
            toCount,
            dropOff,
            dropOffPercent,
            retained: toCount,
            retainedPercent,
          };

          results.push(item);

          if (fromCount > 0 && (!worst || dropOffPercent > worst.dropOffPercent)) {
            worst = item;
          }
        }

        setDropOffs(results);
        setWorstStep(worst);
      } catch (error) {
        console.error("Failed to fetch drop-off data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const hasData = dropOffs.some((d) => d.fromCount > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-destructive" />
          Drop-Off Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="text-center py-8 text-muted-foreground">
            No drop-off data yet. Events will appear as users progress through the funnel.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Worst step callout */}
            {worstStep && worstStep.fromCount > 0 && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Biggest drop-off: {worstStep.fromLabel} → {worstStep.toLabel}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {worstStep.dropOffPercent.toFixed(1)}% of users leave at this step ({worstStep.dropOff} of {worstStep.fromCount})
                  </p>
                </div>
              </div>
            )}

            {/* Step-by-step breakdown */}
            <div className="space-y-2">
              {dropOffs.map((step, index) => (
                <div key={index} className="rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-foreground">{step.fromLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{step.toLabel}</span>
                  </div>

                  {step.fromCount === 0 ? (
                    <p className="text-xs text-muted-foreground">No users at this stage</p>
                  ) : (
                    <>
                      {/* Stacked bar */}
                      <div className="w-full h-5 rounded-full overflow-hidden flex bg-muted">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${step.retainedPercent}%` }}
                        />
                        <div
                          className="h-full bg-destructive/40 transition-all duration-500"
                          style={{ width: `${step.dropOffPercent}%` }}
                        />
                      </div>

                      <div className="flex justify-between mt-1.5 text-xs">
                        <span className="text-primary font-medium">
                          ✓ {step.retained} continued ({step.retainedPercent.toFixed(1)}%)
                        </span>
                        <span className="text-destructive font-medium">
                          ✗ {step.dropOff} dropped ({step.dropOffPercent.toFixed(1)}%)
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            {dropOffs[0]?.fromCount > 0 && (
              <div className="pt-3 border-t grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-foreground">{dropOffs[0].fromCount}</p>
                  <p className="text-xs text-muted-foreground">Entered funnel</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {dropOffs[dropOffs.length - 1]?.toCount || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">
                    {dropOffs[0].fromCount - (dropOffs[dropOffs.length - 1]?.toCount || 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total lost</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
