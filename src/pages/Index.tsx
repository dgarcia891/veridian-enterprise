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

const Index = () => {
  const primaryService = services[0];

  return (
    <>
      <Helmet>
        <title>AI Voice Receptionist - Never Miss a Call | AI Agents 3000</title>
        <meta name="description" content="24/7 AI voice receptionist service for local businesses. Never miss a customer call again. Setup in 10 minutes. 100% call answer rate. Get started today." />
        <link rel="canonical" href="https://veridian.lovable.app/" />
        <meta property="og:title" content="AI Voice Receptionist - Never Miss a Call | AI Agents 3000" />
        <meta property="og:description" content="24/7 AI voice receptionist service for local businesses. Never miss a customer call again. Setup in 10 minutes. 100% call answer rate." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://veridian.lovable.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Voice Receptionist - Never Miss a Call | AI Agents 3000" />
        <meta name="twitter:description" content="24/7 AI voice receptionist service for local businesses. Never miss a customer call again. Setup in 10 minutes." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AI Agents 3000",
            "description": "AI Voice Receptionist Service",
            "url": "https://veridian.lovable.app",
            "logo": "https://veridian.lovable.app/favicon.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-661-263-4388",
              "contactType": "Customer Service",
              "areaServed": "US",
              "availableLanguage": "English"
            },
            "sameAs": []
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

        {/* Blog CTA Section */}
        <section className="px-6 py-20 bg-accent/30">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Learn More About AI Voice Technology</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover insights, case studies, and best practices for implementing AI voice assistants in your business.
            </p>
            <a 
              href="/blog"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:scale-105 transition-transform text-lg"
            >
              Explore Our Blog
            </a>
          </div>
        </section>
      </main>
      
        <Footer />
      </div>
    </>
  );
};

export default Index;
