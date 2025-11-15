import { useState, lazy, Suspense } from "react";
import { ContactDialog } from "@/components/signup/ContactDialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PlanType } from "@/hooks/usePlanPricing";
import { ContactInfoForm } from "@/components/signup/ContactInfoForm";
import { BusinessDetailsForm } from "@/components/signup/BusinessDetailsForm";
import { PlanSelectionForm } from "@/components/signup/PlanSelectionForm";
import { SignupFormSkeleton } from "@/components/signup/SignupFormSkeleton";
const Footer = lazy(() => import("@/components/Footer"));
const formSchema = z.object({
  planType: z.enum(["monthly", "annual", "medical"])
});
type FormValues = z.infer<typeof formSchema>;
const Signup = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("annual");
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      planType: "annual"
    }
  });
  const watchPlanType = form.watch("planType") as PlanType;
  const handleGetStarted = (values: FormValues) => {
    setSelectedPlan(values.planType);
    setShowContactDialog(true);
  };
  const handleContactSubmit = async (contactValues: any) => {
    setIsSubmitting(true);
    setIsProcessingPayment(true);
    try {
      // Save signup data to database
      const {
        data: signupData,
        error: signupError
      } = await supabase.from("customer_signups").insert({
        contact_name: contactValues.contactName,
        email: contactValues.email,
        phone: contactValues.phone,
        company_name: contactValues.contactName,
        // Using contact name as company name
        industry: contactValues.industry || null,
        average_calls_per_day: contactValues.averageCallsPerDay ? parseInt(contactValues.averageCallsPerDay) : null,
        current_phone_system: contactValues.currentPhoneSystem || null,
        plan_type: selectedPlan,
        wants_call_first: false
      }).select().single();
      if (signupError) throw signupError;

      // Process payment
      const {
        data: checkoutData,
        error: checkoutError
      } = await supabase.functions.invoke("create-payment", {
        body: {
          signupId: signupData.id,
          planType: selectedPlan,
          email: contactValues.email
        }
      });
      if (checkoutError) throw checkoutError;

      // Open Stripe checkout
      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process signup. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      setIsProcessingPayment(false);
    }
  };
  return <>
      <Navigation />
      <main className="min-h-screen pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Get Started with Voice AI Receptionist
            </h1>
            <p className="text-xl text-muted-foreground">
              Fill out the form below to start your 24/7 AI-powered phone answering system
            </p>
          </div>

          <Card>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleGetStarted)} className="space-y-6">
                  <PlanSelectionForm control={form.control} />
                  
                  <div className="bg-muted/30 rounded-lg p-6">
                    <h3 className="font-semibold mb-4">What's Included</h3>
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>Unlimited call handling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>24/7 availability</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>Lead qualification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>Appointment booking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span>Calendar integration</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button type="submit" size="sm" className="px-6">
                      Secure Enrollment & Launch
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    By clicking continue, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* What Happens Next Section */}
          <div className="mt-16 space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">What Happens After Enrollment</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We make it easy to get your AI receptionist up and running in just a few simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <CardTitle>Secure Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Complete your enrollment through our secure Stripe payment portal. Your subscription begins immediately after payment confirmation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <CardTitle>Onboarding Call</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Within 24 hours, our team will contact you to schedule a personalized onboarding session. We'll learn about your business and configure your AI receptionist.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <CardTitle>Go Live</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your AI receptionist is deployed and ready to handle calls 24/7. We provide training, documentation, and ongoing support to ensure your success.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Implementation Timeline */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-2xl">Implementation Timeline</CardTitle>
                <CardDescription>From enrollment to full deployment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-24 font-semibold text-primary">Day 1</div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Payment & Welcome</div>
                    <p className="text-sm text-muted-foreground">Complete enrollment and receive your welcome email with next steps</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-24 font-semibold text-primary">Days 2-3</div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Discovery & Configuration</div>
                    <p className="text-sm text-muted-foreground">Onboarding call to understand your business, customize AI responses, and integrate with your calendar</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-24 font-semibold text-primary">Days 4-5</div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Testing & Training</div>
                    <p className="text-sm text-muted-foreground">Test calls with your team, refine responses, and train your staff on the dashboard</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-24 font-semibold text-primary">Day 6+</div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Launch & Support</div>
                    <p className="text-sm text-muted-foreground">Go live with 24/7 call handling. Ongoing optimization and dedicated support included</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Receive */}
            <div className="text-center space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">What You'll Receive</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to transform your phone system with AI
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Custom AI Phone Number</div>
                    <p className="text-sm text-muted-foreground">Dedicated phone number or forward your existing number</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Personalized AI Training</div>
                    <p className="text-sm text-muted-foreground">AI learns your business, services, and common questions</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Calendar Integration</div>
                    <p className="text-sm text-muted-foreground">Automatic appointment booking with your calendar system</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Real-Time Dashboard</div>
                    <p className="text-sm text-muted-foreground">Monitor calls, leads, and performance metrics</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Email & SMS Notifications</div>
                    <p className="text-sm text-muted-foreground">Instant alerts for new leads and appointments</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Ongoing Support & Updates</div>
                    <p className="text-sm text-muted-foreground">Dedicated support team and regular AI improvements</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel your subscription at any time. Annual plans are billed upfront but offer significant savings. Monthly plans can be canceled with no long-term commitment.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Do I need special equipment?</h4>
                  <p className="text-sm text-muted-foreground">
                    No special equipment needed. You can use your existing phone number with call forwarding, or we'll provide a new dedicated number. Everything works through the cloud.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">How quickly can I get started?</h4>
                  <p className="text-sm text-muted-foreground">
                    Most clients are fully operational within 5-7 days. Emergency rush setup is available for an additional fee if you need to launch faster.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">What if callers prefer a human?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can configure fallback options to transfer calls to your team during business hours, or have the AI take detailed messages for after-hours calls.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Final CTA */}
            <div className="text-center space-y-6 py-12">
              <h3 className="text-3xl font-bold">Ready to Never Miss Another Call?</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of businesses that have transformed their customer service with AI
              </p>
              <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Go Back to Enrollment
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <ContactDialog open={showContactDialog} onOpenChange={setShowContactDialog} onSubmit={handleContactSubmit} isSubmitting={isSubmitting || isProcessingPayment} />
      
      <Suspense fallback={<div className="h-20" />}>
        <Footer />
      </Suspense>
    </>;
};
export default Signup;