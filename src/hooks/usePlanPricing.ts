import { useMemo } from "react";

export type PlanType = "monthly" | "annual" | "medical";

export interface PlanPricing {
  monthly: string;
  total: string;
  setupFee: string;
}

export const PLAN_PRICING: Record<PlanType, PlanPricing> = {
  annual: { 
    monthly: "$500", 
    total: "$6,000/year", 
    setupFee: "$0" 
  },
  medical: { 
    monthly: "$2,000", 
    total: "$24,000/year", 
    setupFee: "$0" 
  },
  monthly: { 
    monthly: "$1,000", 
    total: "$1,000/month", 
    setupFee: "$450" 
  },
};

export const usePlanPricing = (planType: PlanType) => {
  return useMemo(() => PLAN_PRICING[planType], [planType]);
};
