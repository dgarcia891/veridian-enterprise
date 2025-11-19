import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

interface RevenueAnalysisProps {
  dailyLoss: number;
  monthlyLoss: number;
  annualLoss: number;
  missedCalls: number;
}

const RevenueAnalysis = ({ dailyLoss, monthlyLoss, annualLoss, missedCalls }: RevenueAnalysisProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // AI agent cost (example: $297/month)
  const monthlyAICost = 297;
  const annualAICost = monthlyAICost * 12;
  const annualSavings = annualLoss - annualAICost;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-2xl">Revenue Recovery Opportunity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <TrendingDown className="h-5 w-5" />
              <span className="text-sm font-medium">Daily Loss</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(dailyLoss)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              From {Math.round(missedCalls / 7)} missed calls/day
            </p>
          </div>

          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <TrendingDown className="h-5 w-5" />
              <span className="text-sm font-medium">Monthly Loss</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(monthlyLoss)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              From {missedCalls} missed calls/week
            </p>
          </div>

          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <TrendingDown className="h-5 w-5" />
              <span className="text-sm font-medium">Annual Loss</span>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(annualLoss)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Projected yearly impact
            </p>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2 text-primary mb-3">
            <TrendingUp className="h-6 w-6" />
            <h3 className="text-xl font-semibold">Potential Annual Savings with AI</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Recovered Revenue:</span>
              <span className="font-semibold">{formatCurrency(annualLoss)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">AI Agent Cost:</span>
              <span className="font-semibold">- {formatCurrency(annualAICost)}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Net Annual Gain:</span>
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(annualSavings)}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            <DollarSign className="inline h-4 w-4 mr-1" />
            ROI: {Math.round((annualSavings / annualAICost) * 100)}% annual return on investment
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueAnalysis;
