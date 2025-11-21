import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Phone, PhoneOff, TrendingDown, AlertCircle } from "lucide-react";
import { RoofingCalculation } from "@/hooks/useRoofingCalculation";

interface RoofingQuickResultsProps {
  calculation: RoofingCalculation;
  businessName: string;
}

const RoofingQuickResults = ({ calculation, businessName }: RoofingQuickResultsProps) => {
  const captureRate = 100 - (calculation.missedCallsPerWeek / calculation.weeklyCallsInput * 100);
  const missRate = 100 - captureRate;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">
          {businessName}, Here's What You're Losing
        </h1>
        <p className="text-lg text-muted-foreground">
          Based on {calculation.weeklyCallsInput} calls per week
        </p>
      </div>

      {/* Hero Metric - Lost Revenue */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingDown className="h-6 w-6 text-destructive" />
            <span className="text-lg font-medium text-destructive">Estimated Monthly Loss</span>
          </div>
          <div className="text-6xl font-bold text-destructive mb-2">
            {formatCurrency(calculation.monthlyRevenueLostLow)} - {formatCurrency(calculation.monthlyRevenueLostHigh)}
          </div>
          <p className="text-lg text-muted-foreground">
            That's {formatCurrency(calculation.annualRevenueLostLow)} - {formatCurrency(calculation.annualRevenueLostHigh)} per year
          </p>
        </CardContent>
      </Card>

      {/* Visual Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Call Capture Rate */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Answered Calls</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">
                  {Math.round(captureRate)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  ~{calculation.weeklyCallsInput - calculation.missedCallsPerWeek} per week
                </span>
              </div>
              <Progress value={captureRate} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Missed Calls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <PhoneOff className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-lg">Missed Calls</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-destructive">
                  {Math.round(missRate)}%
                </span>
                <span className="text-sm text-muted-foreground">
                  ~{calculation.missedCallsPerWeek} per week
                </span>
              </div>
              <Progress value={missRate} className="h-3 bg-muted [&>div]:bg-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-1">85%</div>
            <p className="text-sm text-muted-foreground">
              of callers won't leave voicemail
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-1">
              {calculation.lostCallsPerMonth}
            </div>
            <p className="text-sm text-muted-foreground">
              calls lost per month (after callbacks)
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold mb-1">
              {formatCurrency((calculation.avgJobValueLow + calculation.avgJobValueHigh) / 2)}
            </div>
            <p className="text-sm text-muted-foreground">
              average roofing job value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How We Calculated */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-2">How we calculated this:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {calculation.weeklyCallsInput} calls/week × 35% miss rate = {calculation.missedCallsPerWeek} missed calls/week</li>
                <li>• {calculation.missedCallsPerMonth} missed calls/month × 85% won't call back = {calculation.lostCallsPerMonth} lost opportunities</li>
                <li>• {calculation.lostCallsPerMonth} opportunities × 25% conversion rate × ${calculation.avgJobValueLow}-${calculation.avgJobValueHigh} = monthly loss</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoofingQuickResults;
