import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useGradingSystem } from "./useGradingSystem";
import { useTrafficEstimation } from "./useTrafficEstimation";

export interface EnhancedBusinessMetrics {
  // Original fields
  missedCallsPerWeek: number;
  avgProfitPerCustomer: number;
  industry: string;
  currentCallMethod: string;
  websiteUrl: string;
  websiteVisitsPerMonth?: number;
  clientsPerMonth: number;
  
  // New fields
  newCustomersPerMonth: number;
  percentFromWebsite: number;
  monthlyWebsiteLeads: number;
  leadCloseRate: number;
  visitorLeadConversion: string;
  speedOfFollowup: string;
  followupCompletionRate: number;
  messagingPreferenceRate: number;
  afterHoursImportance: string;
}

export interface EnhancedContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
}

export interface LostRevenueBreakdown {
  lostFromMissedCalls: number;
  lostFromSlowResponse: number;
  lostFromFollowup: number;
  lostMessagingOnly: number;
  lostAfterHours: number;
  lostContentGaps: number;
  lostContactFriction: number;
  lostNoChat: number;
  lostNoScheduling: number;
  totalLostCustomers: number;
  totalMonthlyLostRevenue: number;
  totalAnnualLostRevenue: number;
}

export interface RecoveryCalculations {
  recoveredCustomers: number;
  recoveredMonthlyRevenue: number;
  recoveredAnnualRevenue: number;
  recoveryRate: number;
}

export interface ROIMetrics {
  monthlyAICost: number;
  monthlyNetGain: number;
  annualNetGain: number;
  roiMultiplier: number;
  roiPercentage: number;
}

export interface EnhancedAuditResults {
  trafficEstimate: number;
  leadsRequired: number;
  customersFromWeb: number;
  lostRevenueBreakdown: LostRevenueBreakdown;
  recoveryCalculations: RecoveryCalculations;
  roiMetrics: ROIMetrics;
  grades: {
    leadConversionGrade: string;
    contactAccessibilityGrade: string;
    automationReadinessGrade: string;
    customerExperienceGrade: string;
    aiImpactPotentialGrade: string;
    overallGrade: string;
  };
}

export const useEnhancedAuditCalculation = () => {
  const { toast } = useToast();
  const { calculateAllGrades } = useGradingSystem();
  const { calculateTraffic } = useTrafficEstimation();

  const calculateLostRevenue = (
    metrics: EnhancedBusinessMetrics,
    monthlyLeads: number,
    websiteAnalysis: any
  ): LostRevenueBreakdown => {
    const conversionRate = metrics.leadCloseRate / 100;
    
    // 1. Lost from missed calls (15% callback rate)
    const missedCallsPerMonth = (metrics.missedCallsPerWeek * 52) / 12;
    const lostFromMissedCalls = missedCallsPerMonth * 0.15 * metrics.avgProfitPerCustomer;
    
    // 2. Lost from slow response
    const responseLossRate: Record<string, number> = {
      'within-5min': 0,
      'within-1hr': 0.1,
      'within-4hrs': 0.3,
      'within-24hrs': 0.5,
      'slower': 0.7,
    };
    const lossRate = responseLossRate[metrics.speedOfFollowup] || 0.5;
    const lostFromSlowResponse = monthlyLeads * lossRate * conversionRate * metrics.avgProfitPerCustomer;
    
    // 3. Lost from incomplete follow-up
    const followupRate = metrics.followupCompletionRate / 100;
    const lostFromFollowup = monthlyLeads * (1 - followupRate) * conversionRate * metrics.avgProfitPerCustomer;
    
    // 4. Lost from messaging-only preference
    const hasChat = websiteAnalysis?.opportunities?.some((o: any) => 
      o.title?.toLowerCase().includes('chat')
    ) || false;
    const messagingRate = metrics.messagingPreferenceRate / 100;
    const lostMessagingOnly = !hasChat 
      ? monthlyLeads * messagingRate * 0.4 * conversionRate * metrics.avgProfitPerCustomer
      : 0;
    
    // 5. Lost from after-hours
    const afterHoursLossRate: Record<string, number> = {
      'critical': 0.3,
      'important': 0.2,
      'moderate': 0.1,
      'not-important': 0,
    };
    const afterHoursRate = afterHoursLossRate[metrics.afterHoursImportance] || 0;
    const lostAfterHours = monthlyLeads * afterHoursRate * conversionRate * metrics.avgProfitPerCustomer;
    
    // 6. Lost from content gaps (estimated from website score)
    const contentScore = websiteAnalysis?.contentScore || 70;
    const trafficEstimate = metrics.websiteVisitsPerMonth || 1000;
    const lostContentGaps = trafficEstimate * (1 - contentScore / 100) * 0.05 * conversionRate * metrics.avgProfitPerCustomer;
    
    // 7. Lost from contact friction
    const contactScore = websiteAnalysis?.contactScore || 70;
    const lostContactFriction = trafficEstimate * (1 - contactScore / 100) * 0.03 * conversionRate * metrics.avgProfitPerCustomer;
    
    // 8. Lost from no chat widget
    const lostNoChat = !hasChat ? trafficEstimate * 0.02 * conversionRate * metrics.avgProfitPerCustomer : 0;
    
    // 9. Lost from no scheduling
    const hasScheduling = websiteAnalysis?.opportunities?.some((o: any) => 
      o.title?.toLowerCase().includes('schedul')
    ) || false;
    const lostNoScheduling = !hasScheduling ? monthlyLeads * 0.15 * conversionRate * metrics.avgProfitPerCustomer : 0;
    
    const totalMonthlyLostRevenue = 
      lostFromMissedCalls +
      lostFromSlowResponse +
      lostFromFollowup +
      lostMessagingOnly +
      lostAfterHours +
      lostContentGaps +
      lostContactFriction +
      lostNoChat +
      lostNoScheduling;
    
    const totalLostCustomers = totalMonthlyLostRevenue / metrics.avgProfitPerCustomer;
    const totalAnnualLostRevenue = totalMonthlyLostRevenue * 12;

    return {
      lostFromMissedCalls,
      lostFromSlowResponse,
      lostFromFollowup,
      lostMessagingOnly,
      lostAfterHours,
      lostContentGaps,
      lostContactFriction,
      lostNoChat,
      lostNoScheduling,
      totalLostCustomers,
      totalMonthlyLostRevenue,
      totalAnnualLostRevenue,
    };
  };

  const calculateRecovery = (lostRevenue: LostRevenueBreakdown): RecoveryCalculations => {
    const recoveryRate = 0.75;
    return {
      recoveredCustomers: lostRevenue.totalLostCustomers * recoveryRate,
      recoveredMonthlyRevenue: lostRevenue.totalMonthlyLostRevenue * recoveryRate,
      recoveredAnnualRevenue: lostRevenue.totalAnnualLostRevenue * recoveryRate,
      recoveryRate,
    };
  };

  const calculateROI = (recovery: RecoveryCalculations): ROIMetrics => {
    const monthlyAICost = 600;
    const monthlyNetGain = recovery.recoveredMonthlyRevenue - monthlyAICost;
    const annualNetGain = monthlyNetGain * 12;
    const roiMultiplier = recovery.recoveredMonthlyRevenue / monthlyAICost;
    const roiPercentage = ((recovery.recoveredMonthlyRevenue - monthlyAICost) / monthlyAICost) * 100;

    return {
      monthlyAICost,
      monthlyNetGain,
      annualNetGain,
      roiMultiplier,
      roiPercentage,
    };
  };

  const getEnhancedAuditResults = (
    metrics: EnhancedBusinessMetrics,
    websiteAnalysis: any
  ): EnhancedAuditResults => {
    // Calculate traffic estimation
    const trafficData = calculateTraffic({
      newCustomersPerMonth: metrics.newCustomersPerMonth,
      percentFromWebsite: metrics.percentFromWebsite,
      leadCloseRate: metrics.leadCloseRate,
      visitorLeadConversion: metrics.visitorLeadConversion,
    });

    // Calculate lost revenue
    const lostRevenueBreakdown = calculateLostRevenue(
      metrics,
      metrics.monthlyWebsiteLeads,
      websiteAnalysis
    );

    // Calculate recovery
    const recoveryCalculations = calculateRecovery(lostRevenueBreakdown);

    // Calculate ROI
    const roiMetrics = calculateROI(recoveryCalculations);

    // Calculate grades
    const grades = calculateAllGrades({
      leadCloseRate: metrics.leadCloseRate,
      followupRate: metrics.followupCompletionRate,
      speedOfFollowup: metrics.speedOfFollowup,
      missedCallsPerWeek: metrics.missedCallsPerWeek,
      afterHoursImportance: metrics.afterHoursImportance,
      messagingPreferenceRate: metrics.messagingPreferenceRate,
      websiteScore: websiteAnalysis?.contentScore || 70,
      contactScore: websiteAnalysis?.contactScore || 70,
      roiMultiplier: roiMetrics.roiMultiplier,
      monthlyLostRevenue: lostRevenueBreakdown.totalMonthlyLostRevenue,
    });

    return {
      trafficEstimate: trafficData.estimatedTraffic,
      leadsRequired: trafficData.leadsRequired,
      customersFromWeb: trafficData.customersFromWeb,
      lostRevenueBreakdown,
      recoveryCalculations,
      roiMetrics,
      grades,
    };
  };

  const saveEnhancedAudit = async (
    metrics: EnhancedBusinessMetrics,
    contact: EnhancedContactInfo,
    results: EnhancedAuditResults,
    websiteAnalysis: any
  ): Promise<void> => {
    try {
      const { error } = await supabase.from("ai_audit_submissions").insert({
        first_name: contact.firstName,
        last_name: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        company_name: contact.companyName,
        industry: metrics.industry,
        missed_calls_per_week: metrics.missedCallsPerWeek,
        avg_profit_per_customer: metrics.avgProfitPerCustomer,
        current_call_method: metrics.currentCallMethod,
        website_url: metrics.websiteUrl,
        website_visits_per_month: metrics.websiteVisitsPerMonth,
        clients_per_month: metrics.clientsPerMonth,
        daily_loss: results.lostRevenueBreakdown.totalMonthlyLostRevenue / 30,
        monthly_loss: results.lostRevenueBreakdown.totalMonthlyLostRevenue,
        annual_loss: results.lostRevenueBreakdown.totalAnnualLostRevenue,
        ai_readiness_score: 0,
        score_tier: results.grades.overallGrade,
        recommended_solutions: websiteAnalysis?.opportunities?.map((o: any) => o.title) || [],
        website_analysis: websiteAnalysis,
      } as any);

      if (error) throw error;

      toast({
        title: "Report Saved",
        description: "Your AI opportunity report has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving audit:", error);
      toast({
        title: "Error",
        description: "Failed to save report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    getEnhancedAuditResults,
    saveEnhancedAudit,
  };
};
