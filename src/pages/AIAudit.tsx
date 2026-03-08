import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EnhancedBusinessMetricsForm from "@/components/audit/EnhancedBusinessMetricsForm";
import EnhancedResultsPage from "@/components/audit/EnhancedResultsPage";
import ProcessingScreen from "@/components/audit/ProcessingScreen";
import { useEnhancedAuditCalculation, EnhancedBusinessMetrics, EnhancedContactInfo } from "@/hooks/useEnhancedAuditCalculation";
import { useToast } from "@/hooks/use-toast";
import { useFunnelTracking } from "@/hooks/useFunnelTracking";
import { notifyAdmin } from "@/lib/notifyAdmin";
import confetti from "canvas-confetti";

const AIAudit = () => {
  const [businessMetrics, setBusinessMetrics] = useState<EnhancedBusinessMetrics | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [websiteAnalysis, setWebsiteAnalysis] = useState<any>(null);
  const [auditResults, setAuditResults] = useState<any>(null);
  const [backgroundAnalysis, setBackgroundAnalysis] = useState<any>(null);
  
  const { getEnhancedAuditResults, saveEnhancedAudit } = useEnhancedAuditCalculation();
  const { toast } = useToast();
  const { trackPageVisit, trackAuditStarted, trackAuditCompleted } = useFunnelTracking();

  useEffect(() => {
    trackPageVisit("ai_audit");
  }, [trackPageVisit]);

  const handleMetricsSubmit = async (metrics: EnhancedBusinessMetrics) => {
    trackAuditStarted("enhanced_audit");
    setBusinessMetrics(metrics);
    setIsProcessing(true);
    
    try {
      // Use background analysis if available, otherwise fetch now
      let analysis = backgroundAnalysis;
      
      if (!analysis) {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-website`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ websiteUrl: metrics.websiteUrl, industry: metrics.industry }),
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          analysis = data.analysis;
        } else {
          analysis = { opportunities: [], experienceGaps: [], contentInsights: [], contactScore: 70, contentScore: 70 };
        }
      }
      
      setWebsiteAnalysis(analysis);
      const results = getEnhancedAuditResults(metrics, analysis);
      setAuditResults(results);

      const contactInfo: EnhancedContactInfo = {
        firstName: "Visitor",
        lastName: "",
        email: "visitor@example.com",
        phone: "",
        companyName: metrics.websiteUrl,
      };

      await saveEnhancedAudit(metrics, contactInfo, results, analysis);

      if (results.grades.overallGrade === 'A' || results.grades.overallGrade === 'B') {
        setTimeout(() => confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }), 500);
      }

      trackAuditCompleted("enhanced_audit");
      toast({ title: "Analysis Complete!", description: "Your AI opportunity report is ready." });
    } catch (error) {
      console.error('Error:', error);
      const fallback = { opportunities: [], experienceGaps: [], contentInsights: [], contactScore: 70, contentScore: 70 };
      setWebsiteAnalysis(fallback);
      setAuditResults(getEnhancedAuditResults(metrics, fallback));
    }
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 4000);
  };

  return (
    <>
      <Helmet>
        <title>Free AI Website ROI Audit | AI Agents 3000</title>
        <meta 
          name="description" 
          content="Get a comprehensive AI opportunity assessment for your business. Discover how AI automation can help you recover lost revenue and improve efficiency." 
        />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-4xl mx-auto px-4">
            {isProcessing && <ProcessingScreen />}
            
            {!showResults && !isProcessing && (
              <EnhancedBusinessMetricsForm 
                onSubmit={handleMetricsSubmit}
                onBackgroundAnalysis={setBackgroundAnalysis}
              />
            )}
            
            {showResults && businessMetrics && auditResults && (
              <EnhancedResultsPage
                companyName={businessMetrics.websiteUrl}
                results={auditResults}
                websiteAnalysis={websiteAnalysis}
              />
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AIAudit;
