import { useState, useCallback } from "react";
import { getOpportunitiesForIndustry } from "@/data/aiOpportunities";

export interface BusinessData {
  websiteUrl: string;
  businessName: string;
  industry: string;
  contactName?: string;
  email?: string;
  phone?: string;
}

export interface ROIData {
  recoveredOrders: number;
  cateringAnnual: number;
  total: number;
}

export interface ReportData {
  businessData: BusinessData;
  opportunities: ReturnType<typeof getOpportunitiesForIndustry>;
  roi: ROIData;
  generatedAt: Date;
}

export const useAIReport = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const calculateROI = useCallback((industry: string): ROIData => {
    const opportunities = getOpportunitiesForIndustry(industry);
    const total = opportunities.reduce((sum, opp) => sum + opp.roi, 0);
    
    return {
      recoveredOrders: opportunities[0]?.roi || 0,
      cateringAnnual: opportunities[1]?.roi || 0,
      total
    };
  }, []);

  const generateReport = useCallback((businessData: BusinessData) => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const opportunities = getOpportunitiesForIndustry(businessData.industry);
      const roi = calculateROI(businessData.industry);
      
      setReportData({
        businessData,
        opportunities,
        roi,
        generatedAt: new Date()
      });
      
      setIsGenerating(false);
    }, 1500);
  }, [calculateROI]);

  const resetReport = useCallback(() => {
    setReportData(null);
  }, []);

  return {
    reportData,
    isGenerating,
    generateReport,
    resetReport
  };
};
