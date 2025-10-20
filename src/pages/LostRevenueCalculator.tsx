import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Calculator, DollarSign, Phone, TrendingUp, Mail, Video, Calendar, CheckCircle } from "lucide-react";
import { industries } from "@/data/industries";

const step1Schema = z.object({
  averageCallValue: z.coerce.number().min(1, "Average call value must be at least $1").max(100000, "Please enter a realistic value"),
  missedCallsPerDay: z.coerce.number().min(0, "Cannot be negative").max(1000, "Please enter a realistic number"),
  businessType: z.string().min(1, "Please select a business type"),
});

const step2Schema = step1Schema.extend({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
});

type FormData = z.infer<typeof step2Schema>;

const LostRevenueCalculator = () => {
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [calculatedResults, setCalculatedResults] = useState<{
    daily: number;
    monthly: number;
    yearly: number;
  } | null>(null);
  const [selectedOptions, setSelectedOptions] = useState({
    callBack: false,
    scheduleCall: false,
    emailDetails: false,
    liveDemo: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(step === 1 ? step1Schema : step2Schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (step === 1) {
        // Move to step 2 - expand form
        setStep(2);
        return;
      }

      // Step 2 - Calculate and show results
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

  const handleFollowUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Collect selected options and their data
    const followUpData: any = {
      originalLead: watch(),
      selectedOptions,
    };

    if (selectedOptions.callBack) {
      followUpData.callBack = {
        phone: formData.get("phone"),
        businessName: formData.get("businessName-callBack"),
      };
    }
    if (selectedOptions.scheduleCall) {
      followUpData.scheduleCall = {
        businessName: formData.get("businessName-scheduleCall"),
        preferredDate: formData.get("preferredDate"),
        preferredTime: formData.get("preferredTime"),
      };
    }
    if (selectedOptions.emailDetails) {
      followUpData.emailDetails = {
        businessName: formData.get("businessName-emailDetails"),
      };
    }
    if (selectedOptions.liveDemo) {
      followUpData.liveDemo = {
        businessName: formData.get("businessName-liveDemo"),
      };
    }

    // Here you would send to Trello/CRM
    console.log("Follow-up submitted:", followUpData);

    setShowSuccess(true);
    toast({
      title: "Request Submitted!",
      description: "We'll be in touch soon.",
    });
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
                  Enter your business information to see your potential revenue recovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
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

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="businessType">Type of Business *</Label>
                      <Select onValueChange={(value) => setValue("businessType", value)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select your business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry.id} value={industry.id}>
                              {industry.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.businessType && (
                        <p className="text-sm text-destructive">{errors.businessType.message}</p>
                      )}
                    </div>

                    {step >= 2 && (
                      <>
                        <div className="space-y-2 animate-fade-in">
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

                        <div className="space-y-2 animate-fade-in">
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
                      </>
                    )}
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
          ) : showSuccess ? (
            <Card className="border-primary bg-card">
              <CardContent className="pt-8 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Request Submitted!</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Thank you for your interest. We'll process your request and get back to you soon.
                </p>
                <div className="pt-4">
                  <Link to="/features">
                    <Button size="lg">
                      Learn How Our Automation Works
                    </Button>
                  </Link>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResults(false);
                    setShowSuccess(false);
                    setStep(1);
                    setSelectedOptions({
                      callBack: false,
                      scheduleCall: false,
                      emailDetails: false,
                      liveDemo: false,
                    });
                  }}
                  className="mt-4"
                >
                  Calculate Again
                </Button>
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
                    <h3 className="font-semibold text-lg mb-4 text-center">
                      What would you like to do next?
                    </h3>
                    <p className="text-muted-foreground text-center mb-6">
                      Select one or more options below (you can choose multiple)
                    </p>

                    <form onSubmit={handleFollowUpSubmit} className="space-y-6">
                      {/* Request Call Back */}
                      <div className="border border-border rounded-lg p-4 bg-background">
                        <div className="flex items-start gap-3 mb-3">
                          <Checkbox
                            id="callBack"
                            checked={selectedOptions.callBack}
                            onCheckedChange={(checked) =>
                              setSelectedOptions((prev) => ({ ...prev, callBack: checked as boolean }))
                            }
                          />
                          <div className="flex-1">
                            <Label htmlFor="callBack" className="cursor-pointer font-semibold flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Request a Call Back
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              We'll call you to discuss your needs
                            </p>
                          </div>
                        </div>
                        {selectedOptions.callBack && (
                          <div className="grid md:grid-cols-2 gap-4 mt-4 animate-fade-in">
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number *</Label>
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="(555) 123-4567"
                                className="bg-card"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="businessName-callBack">Business Name *</Label>
                              <Input
                                id="businessName-callBack"
                                name="businessName-callBack"
                                placeholder="Your Business"
                                className="bg-card"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Schedule a Call */}
                      <div className="border border-border rounded-lg p-4 bg-background">
                        <div className="flex items-start gap-3 mb-3">
                          <Checkbox
                            id="scheduleCall"
                            checked={selectedOptions.scheduleCall}
                            onCheckedChange={(checked) =>
                              setSelectedOptions((prev) => ({ ...prev, scheduleCall: checked as boolean }))
                            }
                          />
                          <div className="flex-1">
                            <Label htmlFor="scheduleCall" className="cursor-pointer font-semibold flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Schedule a Call
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              Pick a time that works for you
                            </p>
                          </div>
                        </div>
                        {selectedOptions.scheduleCall && (
                          <div className="grid md:grid-cols-3 gap-4 mt-4 animate-fade-in">
                            <div className="space-y-2">
                              <Label htmlFor="businessName-scheduleCall">Business Name *</Label>
                              <Input
                                id="businessName-scheduleCall"
                                name="businessName-scheduleCall"
                                placeholder="Your Business"
                                className="bg-card"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="preferredDate">Preferred Date *</Label>
                              <Input
                                id="preferredDate"
                                name="preferredDate"
                                type="date"
                                className="bg-card"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="preferredTime">Preferred Time *</Label>
                              <Input
                                id="preferredTime"
                                name="preferredTime"
                                type="time"
                                className="bg-card"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Request Email with Details */}
                      <div className="border border-border rounded-lg p-4 bg-background">
                        <div className="flex items-start gap-3 mb-3">
                          <Checkbox
                            id="emailDetails"
                            checked={selectedOptions.emailDetails}
                            onCheckedChange={(checked) =>
                              setSelectedOptions((prev) => ({ ...prev, emailDetails: checked as boolean }))
                            }
                          />
                          <div className="flex-1">
                            <Label htmlFor="emailDetails" className="cursor-pointer font-semibold flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Request Email with More Details
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              Get detailed information sent to your inbox
                            </p>
                          </div>
                        </div>
                        {selectedOptions.emailDetails && (
                          <div className="mt-4 animate-fade-in">
                            <div className="space-y-2">
                              <Label htmlFor="businessName-emailDetails">Business Name *</Label>
                              <Input
                                id="businessName-emailDetails"
                                name="businessName-emailDetails"
                                placeholder="Your Business"
                                className="bg-card"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* View Live Demo */}
                      <a 
                        href="tel:+16612634388"
                        className="block border border-border rounded-lg p-4 bg-background hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="font-semibold flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              View a Live Demo
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Call +1 (661) 263-4388 to see our Voice AI in action
                            </p>
                          </div>
                        </div>
                      </a>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={!Object.values(selectedOptions).some(Boolean)}
                      >
                        Submit Request
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LostRevenueCalculator;
