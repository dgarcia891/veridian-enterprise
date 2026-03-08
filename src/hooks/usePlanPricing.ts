import { useMemo } from "react";

export type PlanType = "starter" | "growth" | "professional" | "monthly" | "annual" | "medical";

export interface PlanPricing {
  monthly: string;
  total: string;
  setupFee: string;
}

export const PLAN_PRICING: Record<PlanType, PlanPricing> = {
  starter: {
    monthly: "$99",
    total: "$99/month",
    setupFee: "$0",
  },
  growth: {
    monthly: "$199",
    total: "$199/month",
    setupFee: "$0",
  },
  professional: {
    monthly: "$600",
    total: "$600/month",
    setupFee: "$0",
  },
  annual: { 
    monthly: "$600", 
    total: "$7,200/year", 
    setupFee: "$0" 
  },
  medical: { 
    monthly: "$600", 
    total: "$7,200/year", 
    setupFee: "$0" 
  },
  monthly: { 
    monthly: "$600", 
    total: "$600/month", 
    setupFee: "$0" 
  },
};

export const usePlanPricing = (planType: PlanType) => {
  return useMemo(() => PLAN_PRICING[planType], [planType]);
};
