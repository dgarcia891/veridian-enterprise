import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface BusinessData {
  websiteUrl: string;
  businessName: string;
  industry: string;
  contactName?: string;
  email?: string;
  phone?: string;
}

export interface Opportunity {
  title: string;
  description: string;
  bullets: string[];
  whyNow: string;
}

export interface ROIData {
  recoveredOrders: number;
}

export interface ReportData {
  business: {
    name: string;
    url: string;
    industry: string;
  };
  executiveSummary: string;
  opportunities: Opportunity[];
  roi: ROIData;
  generatedAt: Date;
}

export const useAIReport = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = useCallback(async (businessData: BusinessData) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch("https://n8n.srv946115.hstgr.cloud/webhook/ai-insight-build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: businessData.businessName,
          url: businessData.websiteUrl,
          industry: businessData.industry,
          contactName: businessData.contactName,
          email: businessData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to generate report" }));
        console.error("Report generation failed:", response.status, errorData);
        throw new Error(errorData.error || "Failed to generate report");
      }

      const data = await response.json();
      console.log("Report data received:", data);
      
      setReportData({
        business: data.business,
        executiveSummary: data.executiveSummary,
        opportunities: data.opportunities,
        roi: {
          recoveredOrders: data.roi.calc.recoveredOrders
        },
        generatedAt: new Date()
      });
      
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate report. Please try again.");
      setReportData(null);
    } finally {
      setIsGenerating(false);
    }
  }, []);

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
