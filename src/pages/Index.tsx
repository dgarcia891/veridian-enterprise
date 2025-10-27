import ROINavigation from "@/components/roi/ROINavigation";
import ServiceHero from "@/components/ServiceHero";
import ServiceBenefits from "@/components/ServiceBenefits";
import ServiceFeatures from "@/components/ServiceFeatures";
import IndustriesServed from "@/components/IndustriesServed";
import Pricing from "@/components/Pricing";
import SocialProof from "@/components/SocialProof";
import ServiceCTA from "@/components/ServiceCTA";
import Footer from "@/components/Footer";
import { services } from "@/data/services";

const Index = () => {
  const primaryService = services[0];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      
      <ROINavigation />
      
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
  );
};

export default Index;
