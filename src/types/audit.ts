// Legacy types for backward compatibility
export interface BusinessMetrics {
  missedCallsPerWeek: number;
  avgProfitPerCustomer: number;
  industry: string;
  currentCallMethod: string;
  websiteUrl: string;
  websiteVisitsPerMonth?: number;
  clientsPerMonth: number;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
}
