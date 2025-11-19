import { useEffect, useState } from "react";
import { BusinessMetrics, ContactInfo } from "@/pages/AIAudit";
import ReadinessScore from "./ReadinessScore";
import RevenueAnalysis from "./RevenueAnalysis";
import SolutionRecommendations from "./SolutionRecommendations";
import NextStepsSection from "./NextStepsSection";
import PaywallOverlay from "./PaywallOverlay";
import ProcessingScreen from "./ProcessingScreen";
import WebsiteInsights from "./WebsiteInsights";
import { useAuditCalculation } from "@/hooks/useAuditCalculation";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface AuditReportProps {
  businessMetrics: BusinessMetrics;
  contactInfo: ContactInfo | null;
  onContactSubmit: (contact: ContactInfo) => Promise<void>;
  isProcessing: boolean;
}

const AuditReport = ({ businessMetrics, contactInfo, onContactSubmit, isProcessing }: AuditReportProps) => {
  const { toast } = useToast();
  const { getAuditResults } = useAuditCalculation();
  const results = getAuditResults(businessMetrics);
  const [websiteAnalysis, setWebsiteAnalysis] = useState<any>(null);

  useEffect(() => {
    // Load website analysis from session storage
    const analysisData = sessionStorage.getItem('websiteAnalysis');
    if (analysisData) {
      setWebsiteAnalysis(JSON.parse(analysisData));
    }
  }, []);

  useEffect(() => {
    if (contactInfo) {
      toast({
        title: "Your audit report is ready!",
        description: `${contactInfo.firstName}, here's your personalized AI readiness assessment.`,
      });

      // Confetti for high scores
      if (results.score >= 71) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [contactInfo]);

  if (isProcessing) {
    return <ProcessingScreen />;
  }

  return (
    <div className="relative">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your AI Readiness Report
          </h1>
          <p className="text-lg text-muted-foreground">
            Personalized for {contactInfo?.companyName || "Your Business"}
          </p>
        </div>

        <ReadinessScore score={results.score} tier={results.tier} />
        
        {/* Show website insights to everyone (before paywall) */}
        {websiteAnalysis && (
          <WebsiteInsights 
            opportunities={websiteAnalysis.opportunities || []}
            experienceGaps={websiteAnalysis.experienceGaps || []}
            contentInsights={websiteAnalysis.contentInsights || []}
          />
        )}
        
        {/* Show partial preview of revenue analysis */}
        <div className={!contactInfo ? 'relative pb-96' : ''}>
          <div className={!contactInfo ? 'blur-[2px] pointer-events-none select-none' : ''}>
            <RevenueAnalysis
              dailyLoss={results.dailyLoss}
              monthlyLoss={results.monthlyLoss}
              annualLoss={results.annualLoss}
              missedCalls={businessMetrics.missedCallsPerWeek}
            />
            
            <div className="mt-8">
              <SolutionRecommendations
                solutions={results.recommendedSolutions}
                industry={businessMetrics.industry}
              />
            </div>
          </div>
          
          {!contactInfo && (
            <div className="absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-b from-transparent via-background/80 to-background pointer-events-none" />
          )}
        </div>
        
        {contactInfo && <NextStepsSection contactInfo={contactInfo} />}
      </div>

      {!contactInfo && <PaywallOverlay onSubmit={onContactSubmit} />}
    </div>
  );
};

export default AuditReport;
