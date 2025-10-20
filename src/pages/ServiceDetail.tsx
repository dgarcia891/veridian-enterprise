import { useParams, Navigate } from "react-router-dom";
import { getServiceBySlug } from "@/data/services";
import Navigation from "@/components/Navigation";
import ServiceHero from "@/components/ServiceHero";
import ServiceFeatures from "@/components/ServiceFeatures";
import ServiceBenefits from "@/components/ServiceBenefits";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import ServiceCTA from "@/components/ServiceCTA";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  useEffect(() => {
    if (service) {
      document.title = `${service.name} | Veridian`;
    }
  }, [service]);

  if (!service) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">

      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>

      <Navigation />

      <main id="main-content">
        <ServiceHero 
          title={service.tagline}
          subtitle={service.heroSubtitle}
        />

        <ServiceBenefits benefits={service.benefits} />

        <ServiceFeatures 
          features={service.features}
          title="Complete Voice AI Solution"
          subtitle="Everything you need to never miss another revenue opportunity"
        />

        <HowItWorks />

        <Pricing plans={service.pricing} />

        <ServiceCTA 
          headline="Ready to Stop Losing Revenue?"
          description="Join 500+ businesses that never miss a call. Setup takes just 10 minutes, and one recovered call pays for months of service."
          buttonText="Schedule Free Demo"
        />
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
