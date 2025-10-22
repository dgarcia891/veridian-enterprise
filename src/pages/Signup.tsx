import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Phone } from "lucide-react";

const formSchema = z.object({
  contactName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  companyName: z.string().trim().min(2, "Company name is required").max(200),
  industry: z.string().optional(),
  averageCallsPerDay: z.string().optional(),
  currentPhoneSystem: z.string().optional(),
  planType: z.enum(["monthly", "annual"]),
  wantsCallFirst: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactName: "",
      email: "",
      phone: "",
      companyName: "",
      industry: "",
      averageCallsPerDay: "",
      currentPhoneSystem: "",
      planType: "annual",
      wantsCallFirst: false,
    },
  });

  const watchPlanType = form.watch("planType");
  const watchWantsCallFirst = form.watch("wantsCallFirst");

  const getPlanPrice = () => {
    if (watchPlanType === "annual") {
      return { monthly: "$300", total: "$3,600/year", setupFee: "$0" };
    }
    return { monthly: "$600", total: "$600/month", setupFee: "$450" };
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Save signup data to database
      const { data: signupData, error: signupError } = await supabase
        .from("customer_signups")
        .insert({
          contact_name: values.contactName,
          email: values.email,
          phone: values.phone,
          company_name: values.companyName,
          industry: values.industry || null,
          average_calls_per_day: values.averageCallsPerDay ? parseInt(values.averageCallsPerDay) : null,
          current_phone_system: values.currentPhoneSystem || null,
          plan_type: values.planType,
          wants_call_first: values.wantsCallFirst,
        })
        .select()
        .single();

      if (signupError) throw signupError;

      if (values.wantsCallFirst) {
        // Navigate to embedded calendar for scheduling
        toast({
          title: "Registration Successful!",
          description: "Redirecting to schedule your consultation call.",
        });
        navigate("/schedule-consultation");
      } else {
        // Process payment
        setIsProcessingPayment(true);
        const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
          "create-payment",
          {
            body: {
              signupId: signupData.id,
              planType: values.planType,
              email: values.email,
            },
          }
        );

        if (checkoutError) throw checkoutError;
        
        // Open Stripe checkout
        if (checkoutData?.url) {
          window.location.href = checkoutData.url;
        }
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process signup. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      setIsProcessingPayment(false);
    }
  };

  const planDetails = getPlanPrice();

  return (
    <>
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

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {planDetails.monthly}
                  <span className="text-base font-normal text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">{watchPlanType === "annual" ? "Billed annually" : "Billed monthly"}</p>
                {watchPlanType === "monthly" && (
                  <p className="text-sm font-semibold text-primary mt-2">+ {planDetails.setupFee} setup fee</p>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">What's Included</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited call handling</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">24/7 availability</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Lead qualification</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Appointment booking</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Calendar integration</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Tell us about yourself and your business</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Business Details (Optional)</h3>
                    
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="restaurant">Restaurant & Food Service</SelectItem>
                              <SelectItem value="healthcare">Healthcare & Medical</SelectItem>
                              <SelectItem value="retail">Retail & E-commerce</SelectItem>
                              <SelectItem value="professional">Professional Services</SelectItem>
                              <SelectItem value="home-services">Home Services</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="averageCallsPerDay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Calls Per Day</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="50" {...field} />
                          </FormControl>
                          <FormDescription>
                            Helps us understand your call volume
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentPhoneSystem"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Phone System</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your current setup (e.g., traditional phone line, VoIP system, etc.)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="planType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Select Your Plan *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid md:grid-cols-2 gap-4"
                          >
                            <label
                              htmlFor="annual"
                              className={`flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                field.value === "annual"
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <RadioGroupItem value="annual" id="annual" />
                              <div className="flex-1">
                                <div className="font-semibold">Annual Plan (Most Popular)</div>
                                <div className="text-2xl font-bold mt-1">$300<span className="text-base font-normal">/month</span></div>
                                <div className="text-sm text-muted-foreground">Billed $3,600/year</div>
                                <div className="text-sm text-primary font-semibold mt-2">Save $3,600/year</div>
                              </div>
                            </label>

                            <label
                              htmlFor="monthly"
                              className={`flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                field.value === "monthly"
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <RadioGroupItem value="monthly" id="monthly" />
                              <div className="flex-1">
                                <div className="font-semibold">Monthly Plan</div>
                                <div className="text-2xl font-bold mt-1">$600<span className="text-base font-normal">/month</span></div>
                                <div className="text-sm text-muted-foreground">Billed monthly</div>
                                <div className="text-sm text-destructive font-semibold mt-2">+ $450 setup fee</div>
                              </div>
                            </label>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="wantsCallFirst"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>How would you like to proceed? *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => field.onChange(value === "true")}
                            value={field.value ? "true" : "false"}
                            className="space-y-3"
                          >
                            <label
                              htmlFor="pay-now"
                              className={`flex items-start space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                !field.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <RadioGroupItem value="false" id="pay-now" className="mt-1" />
                              <div className="flex-1">
                                <div className="font-semibold">Sign Up Now & Pay</div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  Complete payment now, then schedule your setup appointment
                                </div>
                              </div>
                            </label>

                            <label
                              htmlFor="call-first"
                              className={`flex items-start space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                field.value
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <RadioGroupItem value="true" id="call-first" className="mt-1" />
                              <div className="flex-1">
                                <div className="font-semibold flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  Schedule a Call First
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  Talk to our team before committing - we'll answer questions and help you get started
                                </div>
                              </div>
                            </label>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || isProcessingPayment}
                      className="flex-1"
                    >
                      {isSubmitting || isProcessingPayment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isProcessingPayment ? "Processing..." : "Submitting..."}
                        </>
                      ) : watchWantsCallFirst ? (
                        "Schedule Consultation"
                      ) : (
                        "Proceed to Payment"
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy.
                    {!watchWantsCallFirst && " You will be redirected to Stripe for secure payment processing."}
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Signup;