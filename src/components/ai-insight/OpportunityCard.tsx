import React from "react";
import { LucideIcon } from "lucide-react";

interface OpportunityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  impact: string;
  roi: number;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  icon: Icon,
  title,
  description,
  impact,
  roi
}) => {
  return (
    <div className="glass-card rounded-3xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-primary/10 p-3 flex-shrink-0">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-3">{description}</p>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">{impact}</span>
            <span className="text-lg font-bold text-primary">
              ${roi.toLocaleString()}/year
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
