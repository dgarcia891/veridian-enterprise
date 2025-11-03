import React from "react";
import { TrendingUp, DollarSign } from "lucide-react";

interface ROIBreakdownProps {
  roi: {
    recoveredOrders: number;
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

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Annual Revenue Opportunity</span>
          </div>
          <p className="text-4xl font-bold text-primary">
            ${roi.recoveredOrders.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Estimated annual impact from AI implementation</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <strong>Methodology:</strong> Based on industry analysis, call patterns, and typical conversion rates.
          Actual results may vary based on your specific business operations and implementation.
        </p>
      </div>
    </div>
  );
};
