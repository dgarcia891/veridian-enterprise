import { useMemo } from "react";

export const useROICalculation = (missedCallsPerWeek: number, avgCustomerValue: number) => {
  return useMemo(() => {
    const callbackRate = 0.15; // 85% don't call back
    const workingDaysPerYear = 250;
    const workingDaysPerWeek = 5;
    
    // Convert weekly to daily
    const missedCallsPerDay = missedCallsPerWeek / workingDaysPerWeek;
    const dailyLoss = missedCallsPerDay * avgCustomerValue * (1 - callbackRate);
    const monthlyLoss = dailyLoss * 21; // ~21 working days per month
    const annualLoss = dailyLoss * workingDaysPerYear;
    
    return {
      dailyLoss: Math.round(dailyLoss),
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
