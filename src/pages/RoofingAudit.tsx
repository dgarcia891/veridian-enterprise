import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RoofingSimplifiedForm from "@/components/audit/RoofingSimplifiedForm";
import RoofingQuickResults from "@/components/audit/RoofingQuickResults";
import RoofingUpsellSection from "@/components/audit/RoofingUpsellSection";
import EnhancedBusinessMetricsForm from "@/components/audit/EnhancedBusinessMetricsForm";
import EnhancedResultsPage from "@/components/audit/EnhancedResultsPage";
import ProcessingScreen from "@/components/audit/ProcessingScreen";
import { useRoofingCalculation, RoofingCalculation } from "@/hooks/useRoofingCalculation";
import { useEnhancedAuditCalculation, EnhancedBusinessMetrics, EnhancedContactInfo } from "@/hooks/useEnhancedAuditCalculation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

type ViewState = "simplified-form" | "quick-results" | "full-audit" | "processing" | "final-results";

interface SimplifiedFormData {
  businessName: string;
  phone: string;
  callsPerWeek: number;
}

interface UtmParams {
  source?: string;
  campaign?: string;
  medium?: string;
}

const RoofingAudit = () => {
  const [viewState, setViewState] = useState<ViewState>("simplified-form");
  const [simplifiedData, setSimplifiedData] = useState<SimplifiedFormData | null>(null);
  const [calculation, setCalculation] = useState<RoofingCalculation | null>(null);
  const [utmParams, setUtmParams] = useState<UtmParams>({});
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [websiteAnalysis, setWebsiteAnalysis] = useState<any>(null);
  const [auditResults, setAuditResults] = useState<any>(null);
  
  const [searchParams] = useSearchParams();
  const { calculateResults } = useRoofingCalculation();
  const { getEnhancedAuditResults, saveEnhancedAudit } = useEnhancedAuditCalculation();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Capture UTM parameters on mount
  useEffect(() => {
    setUtmParams({
      source: searchParams.get('utm_source') || undefined,
      campaign: searchParams.get('utm_campaign') || undefined,
      medium: searchParams.get('utm_medium') || undefined,
    });
  }, [searchParams]);

  const handleSimplifiedSubmit = async (data: SimplifiedFormData) => {
    setSimplifiedData(data);
    
    // Calculate results
    const results = calculateResults(data.callsPerWeek);
    setCalculation(results);

    // Save to database
    try {
      const { data: submission, error } = await supabase
        .from('ai_audit_submissions')
        .insert({
          company_name: data.businessName,
          phone: data.phone,
          industry: 'Roofing',
          missed_calls_per_week: results.missedCallsPerWeek,
          avg_profit_per_customer: (results.avgJobValueLow + results.avgJobValueHigh) / 2,
          daily_loss: results.monthlyRevenueLostHigh / 30,
          monthly_loss: results.monthlyRevenueLostHigh,
          annual_loss: results.annualRevenueLostHigh,
          ai_readiness_score: 0,
          entry_path: 'roofing',
          quick_result_shown: true,
          completed_full_audit: false,
          utm_source: utmParams.source,
          utm_campaign: utmParams.campaign,
          utm_medium: utmParams.medium,
          current_call_method: 'unknown',
          score_tier: 'Pending',
          recommended_solutions: [],
          first_name: 'Visitor',
          last_name: '',
          email: 'pending@email.com',
          clients_per_month: 0,
        })
        .select()
        .single();

      if (error) throw error;
      setSubmissionId(submission.id);
    } catch (error) {
      console.error('Error saving submission:', error);
      toast({
        title: "Warning",
        description: "Results calculated, but couldn't save. You can still continue.",
        variant: "destructive",
      });
    }

    // Show results
    setViewState("quick-results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpgradeToFull = () => {
    setViewState("full-audit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEmailOnly = async (email: string) => {
    try {
      if (submissionId) {
        await supabase
          .from('ai_audit_submissions')
          .update({ email })
          .eq('id', submissionId);
      }

      toast({
        title: "Email Sent!",
        description: "Check your inbox for your call analysis report.",
      });
      
      // Redirect to home or thank you page
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error updating email:', error);
      toast({
        title: "Error",
        description: "Couldn't send email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFullAuditSubmit = async (metrics: EnhancedBusinessMetrics) => {
    setViewState("processing");
    
    try {
      // Fetch website analysis
      let analysis = null;
      if (metrics.websiteUrl) {
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
        }
      }
      
      if (!analysis) {
        analysis = { 
          opportunities: [], 
          experienceGaps: [], 
          contentInsights: [], 
          contactScore: 70, 
          contentScore: 70 
        };
      }
      
      setWebsiteAnalysis(analysis);
      const results = getEnhancedAuditResults(metrics, analysis);
      setAuditResults(results);

      // Update existing submission
      if (submissionId && simplifiedData) {
        const contactInfo: EnhancedContactInfo = {
          firstName: simplifiedData.businessName.split(' ')[0] || 'Visitor',
          lastName: '',
          email: 'pending@email.com',
          phone: simplifiedData.phone,
          companyName: simplifiedData.businessName,
        };

        await saveEnhancedAudit(metrics, contactInfo, results, analysis);
        
        await supabase
          .from('ai_audit_submissions')
          .update({ completed_full_audit: true })
          .eq('id', submissionId);
      }

      if (results.grades.overallGrade === 'A' || results.grades.overallGrade === 'B') {
        setTimeout(() => confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }), 500);
      }

      toast({ 
        title: "Complete Analysis Ready!", 
        description: "Your comprehensive AI opportunity report is ready." 
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
    
    setTimeout(() => {
      setViewState("final-results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 4000);
  };

  // Store pre-fill context for later use
  const getAuditContext = () => {
    if (!simplifiedData || !calculation) return null;
    
    return {
      fromRoofingPath: true,
      businessName: simplifiedData.businessName,
      phone: simplifiedData.phone,
      estimatedCallVolume: simplifiedData.callsPerWeek,
    };
  };

  return (
    <>
      <Helmet>
        <title>Free Roofing Call Analysis | AI Agents 3000</title>
        <meta 
          name="description" 
          content="Instantly calculate revenue lost from missed calls. Free 30-second analysis for roofing businesses. See how much you could recover with AI."
        />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container px-4">
            {viewState === "simplified-form" && (
              <RoofingSimplifiedForm onSubmit={handleSimplifiedSubmit} />
            )}

            {viewState === "quick-results" && calculation && simplifiedData && (
              <div className="space-y-12">
                <RoofingQuickResults 
                  calculation={calculation}
                  businessName={simplifiedData.businessName}
                />
                <RoofingUpsellSection
                  onUpgradeClick={handleUpgradeToFull}
                  onEmailOnly={handleEmailOnly}
                />
              </div>
            )}

            {viewState === "full-audit" && (
              <div className="max-w-4xl mx-auto">
                <button
                  onClick={() => setViewState("quick-results")}
                  className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Quick Results
                </button>
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold mb-2">
                    Great! Let's Get Your Complete Analysis
                  </h2>
                  <p className="text-muted-foreground">
                    Just a few more details to generate your comprehensive AI opportunity report
                  </p>
                </div>
                <EnhancedBusinessMetricsForm 
                  onSubmit={handleFullAuditSubmit}
                />
              </div>
            )}

            {viewState === "processing" && <ProcessingScreen />}

            {viewState === "final-results" && simplifiedData && auditResults && (
              <EnhancedResultsPage
                companyName={simplifiedData.businessName}
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

export default RoofingAudit;
