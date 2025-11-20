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

// Enhanced types for new form structure
export interface EnhancedBusinessMetricsInput {
  totalCustomersPerMonth: number;
  customerSourceSplit: { website: number; phone: number; other: number };
  websiteKnowledge: "exactly" | "kind-of" | "no-idea";
  textPreference: number;
  phonePreference: number;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
}
