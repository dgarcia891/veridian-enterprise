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
import { RetellVoiceWidget } from "@/components/RetellVoiceWidget";
import { Helmet } from "react-helmet-async";

const AIReceptionist = () => {
  const primaryService = services[0];

  return (
    <>
      <Helmet>
        <title>AI Receptionist - 24/7 Voice AI Phone Service | AI Agents 3000</title>
        <meta name="description" content="Intelligent 24/7 AI receptionist handles calls, books appointments, qualifies leads. 100% answer rate, <1 sec response time. Setup in 10 minutes." />
        <link rel="canonical" href="https://aiagents3000.com/ai-receptionist" />
        <meta property="og:title" content="AI Receptionist - 24/7 Voice AI Phone Service" />
        <meta property="og:description" content="Intelligent 24/7 AI receptionist handles calls, books appointments, qualifies leads. Never miss a customer." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiagents3000.com/ai-receptionist" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Receptionist - 24/7 Voice AI Phone Service" />
        <meta name="twitter:description" content="Intelligent 24/7 AI receptionist handles calls, books appointments, qualifies leads. Never miss a customer." />
        
        {/* Service + HowTo schema for AEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "AI Voice Receptionist",
            "provider": { "@type": "Organization", "name": "AI Agents 3000", "url": "https://aiagents3000.com" },
            "description": "24/7 AI-powered voice receptionist that answers every call, books appointments, qualifies leads, and captures revenue around the clock.",
            "serviceType": "AI Voice Receptionist",
            "areaServed": "US",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "AI Receptionist Plans",
              "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Starter Plan" }, "price": "99", "priceCurrency": "USD" },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Growth Plan" }, "price": "199", "priceCurrency": "USD" },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Professional Plan" }, "price": "600", "priceCurrency": "USD" }
              ]
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Set Up an AI Receptionist for Your Business",
            "description": "Get your AI voice receptionist up and running in under 15 minutes.",
            "totalTime": "PT15M",
            "step": [
              { "@type": "HowToStep", "position": 1, "name": "Sign Up", "text": "Create your account and choose a plan starting at $99/month." },
              { "@type": "HowToStep", "position": 2, "name": "Configure Your Agent", "text": "Enter your business info, hours, services, and FAQ answers." },
              { "@type": "HowToStep", "position": 3, "name": "Get Your Phone Number", "text": "We provision a dedicated AI phone number for your business." },
              { "@type": "HowToStep", "position": 4, "name": "Go Live", "text": "Forward your calls or publish your new number. Your AI receptionist starts answering immediately." }
            ]
          })}
        </script>
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
        <RetellVoiceWidget agentId="agent_2df66bc30b17e2cbf174bf2f3b" />
      </div>
    </>
  );
};

export default AIReceptionist;
