import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Consultation = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
        
        <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Schedule Your Consultation
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Book a time to discuss how AI Agents 3000 can help your business never miss another call.
              </p>
            </div>
            
            <div className="bg-card rounded-2xl shadow-lg p-6 min-h-[700px]">
              <iframe 
                src="https://api.leadconnectorhq.com/widget/booking/keoOUVa8k9FPAFUedUxS" 
                style={{width:"100%",height:"100%",overflow:"hidden"}}
                scrolling="no" 
                id="keoOUVa8k9FPAFUedUxS_1763706660855"
                title="Schedule Consultation"
              />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Consultation;
