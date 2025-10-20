import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calculator, DollarSign, Phone, TrendingUp } from "lucide-react";

const leadFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20, "Phone number must be less than 20 digits"),
  businessName: z.string().trim().min(1, "Business name is required").max(100, "Business name must be less than 100 characters"),
  averageCallValue: z.coerce.number().min(1, "Average call value must be at least $1").max(100000, "Please enter a realistic value"),
  missedCallsPerDay: z.coerce.number().min(0, "Cannot be negative").max(1000, "Please enter a realistic number"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

const LostRevenueCalculator = () => {
  const [showResults, setShowResults] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState<{
    daily: number;
    monthly: number;
    yearly: number;
  } | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      // Calculate lost revenue
      const daily = data.averageCallValue * data.missedCallsPerDay;
      const monthly = daily * 30;
      const yearly = monthly * 12;

      setCalculatedResults({ daily, monthly, yearly });
      setShowResults(true);

      toast({
        title: "Calculation Complete!",
        description: "See your potential revenue recovery below.",
      });

      // Here you would typically send the lead data to your backend/CRM
      console.log("Lead submitted:", { ...data, calculatedResults: { daily, monthly, yearly } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const averageCallValue = watch("averageCallValue");
  const missedCallsPerDay = watch("missedCallsPerDay");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Calculator className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Lost Revenue Calculator
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how much revenue you're losing from missed calls and see how Voice AI can help you capture every opportunity
            </p>
          </div>

          {!showResults ? (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Calculate Your Lost Revenue</CardTitle>
                <CardDescription>
                  Enter your information below to see your potential revenue recovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="John Smith"
                        className="bg-background"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="john@business.com"
                        className="bg-background"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        placeholder="(555) 123-4567"
                        className="bg-background"
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        {...register("businessName")}
                        placeholder="Your Business Name"
                        className="bg-background"
                      />
                      {errors.businessName && (
                        <p className="text-sm text-destructive">{errors.businessName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="averageCallValue">Average Value per Call ($) *</Label>
                      <Input
                        id="averageCallValue"
                        type="number"
                        {...register("averageCallValue")}
                        placeholder="250"
                        className="bg-background"
                        min="1"
                        step="1"
                      />
                      {errors.averageCallValue && (
                        <p className="text-sm text-destructive">{errors.averageCallValue.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="missedCallsPerDay">Missed Calls per Day *</Label>
                      <Input
                        id="missedCallsPerDay"
                        type="number"
                        {...register("missedCallsPerDay")}
                        placeholder="5"
                        className="bg-background"
                        min="0"
                        step="1"
                      />
                      {errors.missedCallsPerDay && (
                        <p className="text-sm text-destructive">{errors.missedCallsPerDay.message}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Calculating..." : "Calculate My Lost Revenue"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card className="border-primary bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Your Lost Revenue Analysis
                  </CardTitle>
                  <CardDescription>
                    Here's how much revenue you could be losing from missed calls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 rounded-lg bg-background border border-border">
                      <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Daily Lost Revenue</p>
                      <p className="text-3xl font-bold text-primary">
                        ${calculatedResults?.daily.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-center p-6 rounded-lg bg-background border border-border">
                      <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Monthly Lost Revenue</p>
                      <p className="text-3xl font-bold text-primary">
                        ${calculatedResults?.monthly.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-center p-6 rounded-lg bg-background border border-primary">
                      <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Yearly Lost Revenue</p>
                      <p className="text-3xl font-bold text-primary">
                        ${calculatedResults?.yearly.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          Stop Losing Revenue Today
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          With Veridian's Voice AI, you can capture every call 24/7 and turn missed opportunities into revenue. Our AI receptionist answers calls instantly, qualifies leads, and books appointments automatically.
                        </p>
                        <Button size="lg" className="w-full md:w-auto">
                          Schedule Free Demo
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setCalculatedResults(null);
                }}
                className="mx-auto block"
              >
                Calculate Again
              </Button>
            </div>
          )}

          {!showResults && averageCallValue && missedCallsPerDay && (
            <Card className="mt-8 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground mb-2">
                  Preview: With these numbers, you could be losing approximately
                </p>
                <p className="text-center text-2xl font-bold text-primary">
                  ${((averageCallValue || 0) * (missedCallsPerDay || 0) * 365).toLocaleString()} per year
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LostRevenueCalculator;
