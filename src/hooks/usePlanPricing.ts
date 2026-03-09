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
  // Legacy plan types kept for backwards compatibility
  annual: { 
    monthly: "$300", 
    total: "$3,600/year", 
    setupFee: "$0" 
  },
  medical: { 
    monthly: "$850", 
    total: "$10,200/year", 
    setupFee: "$0" 
  },
  monthly: { 
    monthly: "$600", 
    total: "$600/month", 
    setupFee: "$0" 
  },
};

// Stripe price IDs for each plan (for reference)
export const STRIPE_PRICE_IDS = {
  starter: "price_1T8t6HBAEKQ21BqojnFwAcq6",
  growth: "price_1T8tDqBAEKQ21BqoKmimepYQ",
  professional: "price_1T8tIuBAEKQ21Bqo7I8vsAg5",
} as const;

export const usePlanPricing = (planType: PlanType) => {
  return useMemo(() => PLAN_PRICING[planType], [planType]);
};
