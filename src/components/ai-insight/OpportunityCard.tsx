import React from "react";
import { Lightbulb } from "lucide-react";

interface OpportunityCardProps {
  title: string;
  description: string;
  bullets: string[];
  whyNow: string;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  title,
  description,
  bullets,
  whyNow
}) => {
  return (
    <div className="glass-card rounded-3xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-primary/10 p-3 flex-shrink-0">
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-3">{description}</p>
          <ul className="space-y-2 mb-4">
            {bullets.map((bullet, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="pt-3 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-1">Why Now?</p>
            <p className="text-sm text-muted-foreground">{whyNow}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
