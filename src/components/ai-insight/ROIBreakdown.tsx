import React from "react";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";

interface ROIBreakdownProps {
  roi: {
    recoveredOrders: number;
    cateringAnnual: number;
    total: number;
  };
  businessName: string;
}

export const ROIBreakdown: React.FC<ROIBreakdownProps> = ({ roi, businessName }) => {
  return (
    <div className="glass-card rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-2xl bg-primary/10 p-3">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Financial Impact for {businessName}</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Primary Revenue Recovery</span>
          </div>
          <p className="text-3xl font-bold text-primary">
            ${roi.recoveredOrders.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">From captured missed calls</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Additional Opportunities</span>
          </div>
          <p className="text-3xl font-bold text-primary">
            ${roi.cateringAnnual.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">From automated booking</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">Total Annual Impact</span>
          </div>
          <p className="text-3xl font-bold text-primary">
            ${roi.total.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Conservative estimate</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <strong>Methodology:</strong> Based on industry averages of 15-25% missed call rate,
          85% customer callback failure, and average transaction values. Actual results may vary
          based on your specific business operations and call volume.
        </p>
      </div>
    </div>
  );
};
