export interface TrafficEstimationInputs {
  newCustomersPerMonth: number;
  percentFromWebsite: number;
  leadCloseRate: number;
  visitorLeadConversion: string;
}

export interface TrafficEstimationResults {
  customersFromWeb: number;
  leadsRequired: number;
  estimatedTraffic: number;
  conversionRate: number;
}

export const useTrafficEstimation = () => {
  const getConversionRate = (quality: string): number => {
    const rates: Record<string, number> = {
      'high': 0.05,
      'medium': 0.035,
      'low': 0.015,
      'very-low': 0.005,
    };
    return rates[quality] || 0.025;
  };

  const calculateTraffic = (inputs: TrafficEstimationInputs): TrafficEstimationResults => {
    const customersFromWeb = inputs.newCustomersPerMonth * (inputs.percentFromWebsite / 100);
    const leadsRequired = customersFromWeb / (inputs.leadCloseRate / 100);
    const conversionRate = getConversionRate(inputs.visitorLeadConversion);
    const estimatedTraffic = Math.round(leadsRequired / conversionRate);

    return {
      customersFromWeb: Math.round(customersFromWeb),
      leadsRequired: Math.round(leadsRequired),
      estimatedTraffic,
      conversionRate,
    };
  };

  return { calculateTraffic, getConversionRate };
};
