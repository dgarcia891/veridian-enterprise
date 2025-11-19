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
  const { calculateAudit } = useAuditCalculation();

  const handleMetricsSubmit = (metrics: BusinessMetrics) => {
    setBusinessMetrics(metrics);
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
