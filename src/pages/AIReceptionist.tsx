import Navigation from "@/components/Navigation";
import ServiceHero from "@/components/ServiceHero";
import SolutionSection from "@/components/roi/SolutionSection";
import IndustriesServed from "@/components/IndustriesServed";
import Pricing from "@/components/Pricing";
import SocialProof from "@/components/SocialProof";
import ServiceCTA from "@/components/ServiceCTA";
import Footer from "@/components/Footer";
import { services } from "@/data/services";

const AIReceptionist = () => {
  const primaryService = services[0];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      
      <Navigation />
      
      <main id="main-content">
        <ServiceHero 
          title={primaryService.tagline}
          subtitle={primaryService.description}
        />

        <SolutionSection />

        <IndustriesServed />

        <Pricing plans={primaryService.pricing} />

        <SocialProof />

        <ServiceCTA 
          headline="Ready to Stop Losing Revenue?"
          description="Capture every call, 24/7. Setup takes 10 minutes, and one recovered call pays for months of service."
          buttonText="Get Started Today"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default AIReceptionist;
