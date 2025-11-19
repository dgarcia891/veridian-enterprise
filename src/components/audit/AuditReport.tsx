import { useEffect } from "react";
import { BusinessMetrics, ContactInfo } from "@/pages/AIAudit";
import ReadinessScore from "./ReadinessScore";
import RevenueAnalysis from "./RevenueAnalysis";
import SolutionRecommendations from "./SolutionRecommendations";
import NextStepsSection from "./NextStepsSection";
import { useAuditCalculation } from "@/hooks/useAuditCalculation";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface AuditReportProps {
  businessMetrics: BusinessMetrics;
  contactInfo: ContactInfo;
}

const AuditReport = ({ businessMetrics, contactInfo }: AuditReportProps) => {
  const { toast } = useToast();
  const { getAuditResults } = useAuditCalculation();
  const results = getAuditResults(businessMetrics);

  useEffect(() => {
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
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your AI Readiness Report
        </h1>
        <p className="text-lg text-muted-foreground">
          Personalized for {contactInfo.companyName}
        </p>
      </div>

      <ReadinessScore score={results.score} tier={results.tier} />
      
      <RevenueAnalysis
        dailyLoss={results.dailyLoss}
        monthlyLoss={results.monthlyLoss}
        annualLoss={results.annualLoss}
        missedCalls={businessMetrics.missedCallsPerWeek}
      />
      
      <SolutionRecommendations
        solutions={results.recommendedSolutions}
        industry={businessMetrics.industry}
      />
      
      <NextStepsSection contactInfo={contactInfo} />
    </div>
  );
};

export default AuditReport;
