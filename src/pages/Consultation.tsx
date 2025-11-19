import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Consultation = () => {
  return (
    <>
      <Helmet>
        <title>Schedule Consultation - AI Agents 3000</title>
        <meta 
          name="description" 
          content="Schedule a free consultation to discuss how AI automation can transform your business." 
        />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Schedule Your Consultation
              </h1>
              <p className="text-xl text-muted-foreground">
                Booking form will be added here
              </p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Consultation;
