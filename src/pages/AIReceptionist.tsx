import Navigation from "@/components/Navigation";
import ServiceHero from "@/components/ServiceHero";
import ServiceBenefits from "@/components/ServiceBenefits";
import ServiceFeatures from "@/components/ServiceFeatures";
import IndustriesServed from "@/components/IndustriesServed";
import Pricing from "@/components/Pricing";
import SocialProof from "@/components/SocialProof";
import ServiceCTA from "@/components/ServiceCTA";
import Footer from "@/components/Footer";
import { services } from "@/data/services";
import { Helmet } from "react-helmet";

const AIReceptionist = () => {
  const primaryService = services[0];

  return (
    <>
      <Helmet>
        <title>AI Receptionist - 24/7 Voice AI Phone Service | AI Agents 3000</title>
        <meta name="description" content="Intelligent 24/7 AI receptionist handles calls, books appointments, qualifies leads. 100% answer rate, <1 sec response time. Setup in 10 minutes." />
        <link rel="canonical" href="https://veridian.lovable.app/ai-receptionist" />
        <meta property="og:title" content="AI Receptionist - 24/7 Voice AI Phone Service" />
        <meta property="og:description" content="Intelligent 24/7 AI receptionist handles calls, books appointments, qualifies leads. Never miss a customer." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://veridian.lovable.app/ai-receptionist" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Receptionist - 24/7 Voice AI Phone Service" />
        <meta name="twitter:description" content="Intelligent 24/7 AI receptionist handles calls, books appointments, qualifies leads. Never miss a customer." />
      </Helmet>
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

        <ServiceBenefits benefits={primaryService.benefits} />

        <ServiceFeatures features={primaryService.features} />

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
    </>
  );
};

export default AIReceptionist;
