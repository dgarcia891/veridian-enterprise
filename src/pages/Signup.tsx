import { useState, lazy, Suspense } from "react";
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
  contactName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  companyName: z.string().trim().min(2, "Company name is required").max(200),
  industry: z.string().optional(),
  averageCallsPerDay: z.string().optional(),
  currentPhoneSystem: z.string().optional(),
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
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      contactName: "",
      email: "",
      phone: "",
      companyName: "",
      planType: "annual"
    }
  });
  const watchPlanType = form.watch("planType") as PlanType;
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setIsProcessingPayment(true);
    try {
      // Save signup data to database
      const {
        data: signupData,
        error: signupError
      } = await supabase.from("customer_signups").insert({
        contact_name: values.contactName,
        email: values.email,
        phone: values.phone,
        company_name: values.companyName,
        industry: values.industry || null,
        average_calls_per_day: values.averageCallsPerDay ? parseInt(values.averageCallsPerDay) : null,
        current_phone_system: values.currentPhoneSystem || null,
        plan_type: values.planType,
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
          planType: values.planType,
          email: values.email
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
      <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
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
            <CardHeader>
              <CardTitle>Select Your Plan</CardTitle>
              <CardDescription>Choose the plan that best fits your business needs</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                  <Separator />

                  <ContactInfoForm control={form.control} />

                  <Separator />

                  <BusinessDetailsForm control={form.control} />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting || isProcessingPayment}
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Get 100% Lead Capture Now"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy.
                    You will be redirected to Stripe for secure payment processing.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Suspense fallback={<div className="h-20" />}>
        <Footer />
      </Suspense>
    </>;
};
export default Signup;