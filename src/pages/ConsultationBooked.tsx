import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Calendar, FileText, Phone, ArrowRight } from 'lucide-react';

const ConsultationBooked = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Consultation Booked - AI Agents 3000";
  }, []);

  const preparationSteps = [
    {
      icon: Calendar,
      title: "Check Your Email",
      description: "You'll receive a calendar invite with all the meeting details and a link to join the call."
    },
    {
      icon: FileText,
      title: "Gather Your Information",
      description: "Have your current call handling process documented, including average call volume, business hours, and any specific requirements."
    },
    {
      icon: Phone,
      title: "Prepare Your Questions",
      description: "Think about your pain points with missed calls, customer service challenges, and what you'd like to achieve with an AI receptionist."
    }
  ];

  const whatToExpect = [
    "We'll review your current call handling process",
    "Discuss how AI Agents 3000 can fit your specific needs",
    "Walk through pricing and implementation timeline",
    "Answer all your questions about the service",
    "Create a customized onboarding plan for your business"
  ];

  return (
    <>
      <Helmet>
        <title>Consultation Booked - AI Agents 3000</title>
        <meta name="description" content="Your consultation is confirmed. Here's what to expect and how to prepare for your AI Agents 3000 onboarding call." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        
        <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                You're All Set! 🎉
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your consultation is confirmed. Here's what happens next and how to prepare.
              </p>
            </div>

            {/* What's Next Section */}
            <div className="bg-card rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">What's Next?</h2>
              <div className="space-y-4">
                {preparationSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* What to Expect Section */}
            <div className="bg-card rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">What to Expect on the Call</h2>
              <ul className="space-y-3">
                {whatToExpect.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information Checklist */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Information to Have Ready</h2>
              <p className="text-muted-foreground mb-4">
                Having this information ready will help us create the perfect solution for your business:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Your current phone system details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Average daily/weekly call volume</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Business hours and timezone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Key information callers typically need (FAQs, services, pricing)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Any specific caller handling requirements or preferences</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                Back to Home
              </Button>
              <Button
                onClick={() => navigate('/')}
                size="lg"
                className="gap-2"
              >
                Calculate Your ROI
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ConsultationBooked;
