import { BusinessMetrics, ContactInfo } from "@/pages/AIAudit";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AuditResults {
  score: number;
  tier: string;
  dailyLoss: number;
  monthlyLoss: number;
  annualLoss: number;
  recommendedSolutions: string[];
}

export const useAuditCalculation = () => {
  const { toast } = useToast();

  const calculateScore = (metrics: BusinessMetrics): number => {
    let score = 0;

    // Revenue at Risk (40 points)
    const annualLoss = (metrics.missedCallsPerWeek * 52 * metrics.avgProfitPerCustomer) / 4;
    if (annualLoss > 50000) score += 40;
    else if (annualLoss > 10000) score += 25;
    else score += 10;

    // Industry Fit (30 points)
    const highFitIndustries = ["construction", "home-services", "medical", "legal", "real-estate"];
    const mediumFitIndustries = ["restaurants", "retail", "professional-services"];
    
    if (highFitIndustries.includes(metrics.industry)) score += 30;
    else if (mediumFitIndustries.includes(metrics.industry)) score += 20;
    else score += 10;

    // Call Volume (20 points)
    if (metrics.missedCallsPerWeek > 15) score += 20;
    else if (metrics.missedCallsPerWeek > 5) score += 15;
    else score += 5;

    // Current System Gap (10 points)
    if (metrics.currentCallMethod === "voicemail" || metrics.currentCallMethod === "answer-myself") {
      score += 10;
    } else if (metrics.currentCallMethod === "mix") {
      score += 5;
    }

    return Math.min(100, score);
  };

  const getScoreTier = (score: number): string => {
    if (score >= 71) return "AI Critical";
    if (score >= 41) return "Ready for AI";
    return "Getting Started";
  };

  const getRecommendedSolutions = (metrics: BusinessMetrics): string[] => {
    const solutions = ["voice-receptionist"]; // Always recommend

    // Add chat assistant for industries with high online presence
    const onlineIndustries = ["retail", "professional-services", "real-estate"];
    if (onlineIndustries.includes(metrics.industry)) {
      solutions.push("chat-assistant");
    }

    // Add appointment scheduling for service-based industries
    const appointmentIndustries = ["medical", "home-services", "professional-services", "legal"];
    if (appointmentIndustries.includes(metrics.industry)) {
      solutions.push("appointment-scheduling");
    }

    // Add follow-up for high-value services
    if (metrics.avgProfitPerCustomer > 1000) {
      solutions.push("follow-up-system");
    }

    // Add email assistant for professional services
    if (["professional-services", "legal", "real-estate"].includes(metrics.industry)) {
      solutions.push("email-assistant");
    }

    return solutions;
  };

  const getAuditResults = (metrics: BusinessMetrics): AuditResults => {
    const score = calculateScore(metrics);
    const tier = getScoreTier(score);
    
    // Assume 25% conversion rate on missed calls
    const conversionRate = 0.25;
    const missedCustomersPerWeek = metrics.missedCallsPerWeek * conversionRate;
    
    const dailyLoss = (missedCustomersPerWeek / 7) * metrics.avgProfitPerCustomer;
    const monthlyLoss = missedCustomersPerWeek * 4.33 * metrics.avgProfitPerCustomer;
    const annualLoss = missedCustomersPerWeek * 52 * metrics.avgProfitPerCustomer;

    const recommendedSolutions = getRecommendedSolutions(metrics);

    return {
      score,
      tier,
      dailyLoss,
      monthlyLoss,
      annualLoss,
      recommendedSolutions,
    };
  };

  const calculateAudit = async (
    metrics: BusinessMetrics,
    contact: ContactInfo
  ): Promise<void> => {
    const results = getAuditResults(metrics);

    // Get website analysis from session storage
    const websiteAnalysisData = sessionStorage.getItem('websiteAnalysis');
    const websiteAnalysis = websiteAnalysisData ? JSON.parse(websiteAnalysisData) : null;

    try {
      const { error } = await supabase
        .from("ai_audit_submissions")
        .insert({
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
          website_analysis: websiteAnalysis,
          website_visits_per_month: metrics.websiteVisitsPerMonth,
          clients_per_month: metrics.clientsPerMonth,
          daily_loss: results.dailyLoss,
          monthly_loss: results.monthlyLoss,
          annual_loss: results.annualLoss,
          ai_readiness_score: results.score,
          score_tier: results.tier,
          recommended_solutions: results.recommendedSolutions,
        });

      if (error) {
        console.error("Error saving audit submission:", error);
        toast({
          title: "Note",
          description: "Your audit was generated successfully. There was an issue saving to our system, but you can still see your results.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error in calculateAudit:", error);
    }
  };

  return {
    calculateAudit,
    getAuditResults,
  };
};
