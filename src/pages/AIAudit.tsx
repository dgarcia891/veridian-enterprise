import { useState } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BusinessMetricsForm from "@/components/audit/BusinessMetricsForm";
import ContactCaptureForm from "@/components/audit/ContactCaptureForm";
import AuditReport from "@/components/audit/AuditReport";
import { useAuditCalculation } from "@/hooks/useAuditCalculation";

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

const AIAudit = () => {
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { calculateAudit } = useAuditCalculation();

  const handleMetricsSubmit = async (metrics: BusinessMetrics) => {
    setBusinessMetrics(metrics);
    setIsProcessing(true);
    
    // Analyze website with AI
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-website`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            websiteUrl: metrics.websiteUrl,
            industry: metrics.industry,
          }),
        }
      );
      
      if (response.ok) {
        const { analysis } = await response.json();
        console.log('Website analysis:', analysis);
        // Store analysis for later use in the report
        sessionStorage.setItem('websiteAnalysis', JSON.stringify(analysis));
      }
    } catch (error) {
      console.error('Error analyzing website:', error);
    }
    
    // Show processing animation for 4 seconds (3 seconds + 1 second buffer)
    setTimeout(() => {
      setIsProcessing(false);
    }, 4000);
    
    // Scroll to top when report is shown
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactSubmit = async (contact: ContactInfo) => {
    setContactInfo(contact);
    
    if (businessMetrics) {
      // Calculate audit results and save to database
      await calculateAudit(businessMetrics, contact);
    }
  };

  return (
    <>
      <Helmet>
        <title>Free AI Readiness Audit | AI Agents 3000</title>
        <meta 
          name="description" 
          content="Get a comprehensive AI readiness assessment for your business. Discover how AI voice agents can help you recover lost revenue and improve efficiency." 
        />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-4xl mx-auto px-4">
            {!businessMetrics ? (
              <BusinessMetricsForm onSubmit={handleMetricsSubmit} />
            ) : (
              <AuditReport 
                businessMetrics={businessMetrics}
                contactInfo={contactInfo}
                onContactSubmit={handleContactSubmit}
                isProcessing={isProcessing}
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
