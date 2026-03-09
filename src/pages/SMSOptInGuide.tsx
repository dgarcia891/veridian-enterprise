import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, CheckCircle, Shield, Phone, ArrowRight, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const SMSOptInGuide = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateImage = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-sms-flow-image');
      
      if (fnError) {
        throw new Error(fnError.message);
      }
      
      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate image';
      setError(message);
      toast({
        title: 'Image Generation Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateImage();
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Customer Initiates',
      description: 'Customer texts a keyword (like "JOIN" or "SUBSCRIBE") to your toll-free number.',
      icon: MessageSquare,
    },
    {
      number: 2,
      title: 'Compliance Disclosure',
      description: 'Your system auto-replies with required compliance information: message frequency, data rates, and opt-out instructions.',
      icon: Shield,
    },
    {
      number: 3,
      title: 'Double Opt-In Confirmation',
      description: 'Customer replies "YES" to confirm their subscription, completing the double opt-in process.',
      icon: CheckCircle,
    },
    {
      number: 4,
      title: 'Subscription Active',
      description: 'Customer receives a welcome message confirming their subscription. They\'re now ready to receive your updates!',
      icon: Phone,
    },
  ];

  return (
    <>
      <Helmet>
        <title>SMS Opt-In Process Guide | Toll-Free Messaging Compliance</title>
        <meta name="description" content="Learn how the SMS opt-in process works for toll-free messaging. Understand double opt-in, TCPA compliance, and best practices for SMS marketing." />
      </Helmet>
      
      <Navigation />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                How SMS Opt-In Works
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Understanding the toll-free messaging opt-in process is essential for compliance and building trust with your customers.
              </p>
            </div>

            {/* AI-Generated Image Section */}
            <Card className="mb-16 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-4 p-8">
                      <Skeleton className="w-full h-full absolute inset-0" />
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Generating SMS flow visualization...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center gap-4 p-8">
                      <p className="text-destructive">{error}</p>
                      <Button onClick={generateImage} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  ) : imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="SMS Opt-In Process Flow - showing 4 steps from keyword to confirmation"
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Step by Step Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                The Opt-In Journey
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                  <Card key={step.number} className="relative">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <step.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-primary">Step {step.number}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                      
                      {index < steps.length - 1 && (
                        <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/50" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Compliance Section */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                  Why Compliance Matters
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">TCPA Compliance</h3>
                    <p className="text-sm text-muted-foreground">
                      The Telephone Consumer Protection Act requires explicit consent before sending marketing messages.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Double Opt-In</h3>
                    <p className="text-sm text-muted-foreground">
                      Double opt-in provides verified consent and protects both you and your customers.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <MessageSquare className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">10DLC Registration</h3>
                    <p className="text-sm text-muted-foreground">
                      Toll-free numbers require proper registration to ensure deliverability and compliance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <a href="/schedule-consultation">
                  Get Compliant SMS Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default SMSOptInGuide;
