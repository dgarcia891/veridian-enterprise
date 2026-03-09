import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const AboutCEO = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About the CEO - David Garcia | Veridian Enterprises</title>
        <meta name="description" content="Learn about David Garcia, Founder and CEO of Veridian Enterprises LLC, and his leadership in Salesforce architecture and innovative technology solutions." />
        <link rel="canonical" href="https://veridianenterprise.com/abouttheceo" />
      </Helmet>
      <Navigation />
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">About the CEO</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-foreground mb-4">David Garcia</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              David Garcia is the Founder and CEO of Veridian Enterprises LLC, a company based in Los Angeles, California. 
              With a strong background in Salesforce architecture and administration, David has held various leadership roles, 
              including Director and Senior Manager positions. His expertise in these areas has been instrumental in driving 
              the strategic direction and growth of Veridian Enterprises.
            </p>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              Under his leadership, the company has focused on leveraging innovative technologies to deliver exceptional 
              solutions to its clients. David's commitment to excellence and his visionary approach have positioned 
              Veridian Enterprises as a leader in its field.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutCEO;
