import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { PlanType } from "@/hooks/usePlanPricing";

interface PlanSummaryCardProps {
  planType: PlanType;
  planDetails: {
    monthly: string;
    total: string;
    setupFee: string;
  };
}

const INCLUDED_FEATURES = [
  "Unlimited call handling",
  "24/7 availability",
  "Lead qualification",
  "Appointment booking",
  "Calendar integration",
];

export const PlanSummaryCard = memo(({ planType, planDetails }: PlanSummaryCardProps) => {
  const billingLabel = 
    planType === "annual" 
      ? "Billed annually" 
      : planType === "medical"
      ? "Billed annually (HIPAA-compliant)"
      : "Billed monthly";

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">
            {planDetails.monthly}
            <span className="text-base font-normal text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground">{billingLabel}</p>
          {planType === "monthly" && (
            <p className="text-sm font-semibold text-primary mt-2">
              + {planDetails.setupFee} setup fee
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">What's Included</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-2">
          {INCLUDED_FEATURES.map((feature) => (
            <div key={feature} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
});

PlanSummaryCard.displayName = "PlanSummaryCard";
