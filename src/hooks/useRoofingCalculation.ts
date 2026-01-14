export interface RoofingCalculation {
  weeklyCallsInput: number;
  missedCallsPerWeek: number;
  missedCallsPerMonth: number;
  callbackRate: number;
  lostCallsPerMonth: number;
  avgJobValueLow: number;
  avgJobValueHigh: number;
  conversionRate: number;
  monthlyRevenueLostLow: number;
  monthlyRevenueLostHigh: number;
  annualRevenueLostLow: number;
  annualRevenueLostHigh: number;
}

const ROOFING_CONSTANTS = {
  MISS_RATE: 0.35, // 35% of calls missed
  CALLBACK_RATE: 0.15, // 15% will call back
  AVG_JOB_LOW: 800,
  AVG_JOB_HIGH: 2000,
  CONVERSION_RATE: 0.25, // 25% of qualified calls convert
  
  // For visual stats
  VOICEMAIL_SKIP: 0.85, // 85% don't leave voicemail
  AFTER_HOURS_CALLS: 0.30, // 30% of calls after hours
};

export const useRoofingCalculation = () => {
  const calculateResults = (weeklyCallsInput: number): RoofingCalculation => {
    const missedPerWeek = weeklyCallsInput * ROOFING_CONSTANTS.MISS_RATE;
    const missedPerMonth = missedPerWeek * 4.33; // avg weeks per month
    const lostCalls = missedPerMonth * (1 - ROOFING_CONSTANTS.CALLBACK_RATE);
    const convertedJobs = lostCalls * ROOFING_CONSTANTS.CONVERSION_RATE;
    
    return {
      weeklyCallsInput,
      missedCallsPerWeek: Math.round(missedPerWeek),
      missedCallsPerMonth: Math.round(missedPerMonth),
      callbackRate: ROOFING_CONSTANTS.CALLBACK_RATE,
      lostCallsPerMonth: Math.round(lostCalls),
      avgJobValueLow: ROOFING_CONSTANTS.AVG_JOB_LOW,
      avgJobValueHigh: ROOFING_CONSTANTS.AVG_JOB_HIGH,
      conversionRate: ROOFING_CONSTANTS.CONVERSION_RATE,
      monthlyRevenueLostLow: Math.round(convertedJobs * ROOFING_CONSTANTS.AVG_JOB_LOW),
      monthlyRevenueLostHigh: Math.round(convertedJobs * ROOFING_CONSTANTS.AVG_JOB_HIGH),
      annualRevenueLostLow: Math.round(convertedJobs * ROOFING_CONSTANTS.AVG_JOB_LOW * 12),
      annualRevenueLostHigh: Math.round(convertedJobs * ROOFING_CONSTANTS.AVG_JOB_HIGH * 12),
    };
  };

  return { calculateResults, ROOFING_CONSTANTS };
};
