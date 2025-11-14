import { useMemo } from "react";

export const useROICalculation = (missedCallsPerWeek: number, avgCustomerValue: number) => {
  return useMemo(() => {
    const callbackRate = 0.15; // 85% don't call back
    const weeksPerYear = 52;
    
    const weeklyLoss = missedCallsPerWeek * avgCustomerValue * (1 - callbackRate);
    const monthlyLoss = weeklyLoss * (weeksPerYear / 12); // ~4.33 weeks per month
    const annualLoss = weeklyLoss * weeksPerYear;
    
    return {
      weeklyLoss: Math.round(weeklyLoss),
      monthlyLoss: Math.round(monthlyLoss),
      annualLoss: Math.round(annualLoss),
    };
  }, [missedCallsPerWeek, avgCustomerValue]);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};
