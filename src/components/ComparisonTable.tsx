import { Check, X, Minus } from "lucide-react";

export interface ComparisonFeature {
  feature: string;
  us: string | boolean;
  competitor: string | boolean;
  highlight?: boolean;
}

interface ComparisonTableProps {
  features: ComparisonFeature[];
  competitorName: string;
}

const renderValue = (value: string | boolean) => {
  if (value === true) return <Check className="w-5 h-5 text-primary mx-auto" />;
  if (value === false) return <X className="w-5 h-5 text-destructive/60 mx-auto" />;
  if (value === "—") return <Minus className="w-5 h-5 text-muted-foreground/40 mx-auto" />;
  return <span className="text-sm">{value}</span>;
};

const ComparisonTable = ({ features, competitorName }: ComparisonTableProps) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-muted/50">
            <th className="px-6 py-4 text-sm font-semibold text-foreground w-1/3">Feature</th>
            <th className="px-6 py-4 text-sm font-semibold text-primary text-center w-1/3">
              AI Agents 3000
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-center w-1/3">
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((row, idx) => (
            <tr
              key={idx}
              className={`border-t border-border transition-colors ${
                row.highlight ? "bg-primary/5" : idx % 2 === 0 ? "bg-background" : "bg-muted/20"
              }`}
            >
              <td className="px-6 py-4 text-sm font-medium text-foreground">{row.feature}</td>
              <td className="px-6 py-4 text-center text-foreground">{renderValue(row.us)}</td>
              <td className="px-6 py-4 text-center text-muted-foreground">{renderValue(row.competitor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
