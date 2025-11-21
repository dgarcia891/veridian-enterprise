import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Clock, Zap, Building2, Globe, MessageSquare } from "lucide-react";

const quickAssessmentSchema = z.object({
  industry: z.string().min(1, "Please select your industry"),
  responseTime: z.string().min(1, "Please select response time"),
  afterHoursImportance: z.string().min(1, "Please select after-hours importance"),
  hasWebsite: z.string().min(1, "Please select an option"),
  websiteUrl: z.string().optional(),
  communicationPreference: z.number().min(0).max(100),
});

export type QuickAssessmentData = z.infer<typeof quickAssessmentSchema>;

interface QuickAssessmentFormProps {
  onSubmit: (data: QuickAssessmentData) => void;
  prefilledIndustry?: string;
  businessName?: string;
}

const QuickAssessmentForm = ({ onSubmit, prefilledIndustry, businessName }: QuickAssessmentFormProps) => {
  const [showWebsiteUrl, setShowWebsiteUrl] = useState(false);

  const form = useForm<QuickAssessmentData>({
    resolver: zodResolver(quickAssessmentSchema),
    defaultValues: {
      industry: prefilledIndustry || "",
      responseTime: "",
      afterHoursImportance: "",
      hasWebsite: "",
      websiteUrl: "",
      communicationPreference: 50,
    },
  });

  const hasWebsiteValue = form.watch("hasWebsite");

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-primary/20">
        <CardHeader className="text-center space-y-2 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            Personalize Your AI Opportunity Report
          </h1>
          <p className="text-lg text-muted-foreground">
            5 quick questions to show you exactly how AI can recover lost revenue
            {businessName && <span className="font-semibold text-foreground"> for {businessName}</span>}
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Takes 90 seconds
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* 1. Industry */}
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base">
                      <Building2 className="h-5 w-5 text-primary" />
                      What industry are you in?
                    </FormLabel>
                    <FormDescription>
                      We'll personalize recommendations for your specific market
                    </FormDescription>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-background">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="Roofing">Roofing</SelectItem>
                        <SelectItem value="HVAC">HVAC</SelectItem>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="General Contracting">General Contracting</SelectItem>
                        <SelectItem value="Landscaping">Landscaping</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Legal">Legal Services</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Automotive">Automotive</SelectItem>
                        <SelectItem value="Restaurant">Restaurant/Food Service</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* 2. Response Time */}
              <FormField
                control={form.control}
                name="responseTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base">
                      <Zap className="h-5 w-5 text-primary" />
                      How quickly do you typically respond to new inquiries?
                    </FormLabel>
                    <FormDescription>
                      Be honest - this helps us show your biggest opportunities
                    </FormDescription>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { value: "5min", label: "Within 5 minutes", icon: "⚡" },
                          { value: "1hr", label: "Within 1 hour", icon: "🕐" },
                          { value: "4hrs", label: "Within 4 hours", icon: "🕓" },
                          { value: "24hrs", label: "Within 24 hours", icon: "📅" },
                          { value: "longer", label: "Longer than 24 hours", icon: "😬", className: "md:col-span-2" },
                        ].map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={field.value === option.value ? "default" : "outline"}
                            className={`h-auto py-4 px-4 flex flex-col items-center gap-2 ${option.className || ""}`}
                            onClick={() => field.onChange(option.value)}
                          >
                            <span className="text-2xl">{option.icon}</span>
                            <span className="text-sm">{option.label}</span>
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* 3. After-Hours Importance */}
              <FormField
                control={form.control}
                name="afterHoursImportance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      How important is capturing after-hours calls & texts?
                    </FormLabel>
                    <FormDescription>
                      Evening, weekend, and holiday inquiries
                    </FormDescription>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { value: "critical", label: "Critical - We lose customers", icon: "🔴" },
                          { value: "important", label: "Important - It matters", icon: "🟡" },
                          { value: "moderate", label: "Moderate - Nice to have", icon: "🟢" },
                          { value: "minimal", label: "Minimal - Not a priority", icon: "⚪" },
                        ].map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={field.value === option.value ? "default" : "outline"}
                            className="h-auto py-4 px-3 flex flex-col items-center gap-2"
                            onClick={() => field.onChange(option.value)}
                          >
                            <span className="text-2xl">{option.icon}</span>
                            <span className="text-xs text-center">{option.label}</span>
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* 4. Website */}
              <FormField
                control={form.control}
                name="hasWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base">
                      <Globe className="h-5 w-5 text-primary" />
                      Do you have a business website?
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" },
                          { value: "coming-soon", label: "Coming Soon" },
                        ].map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={field.value === option.value ? "default" : "outline"}
                            className="h-12"
                            onClick={() => {
                              field.onChange(option.value);
                              setShowWebsiteUrl(option.value === "yes");
                            }}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    
                    {hasWebsiteValue === "yes" && (
                      <FormField
                        control={form.control}
                        name="websiteUrl"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel className="text-sm">Website URL (optional)</FormLabel>
                            <FormDescription className="text-xs">
                              We'll analyze it for opportunities
                            </FormDescription>
                            <FormControl>
                              <Input 
                                placeholder="https://yourwebsite.com" 
                                {...field}
                                className="h-11"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {hasWebsiteValue === "no" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        No problem - we'll show you why AI can help without one
                      </p>
                    )}
                    
                    {hasWebsiteValue === "coming-soon" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Perfect timing to add AI from day one
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* 5. Communication Preference */}
              <FormField
                control={form.control}
                name="communicationPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      How do most customers prefer to reach you?
                    </FormLabel>
                    <FormDescription>
                      This helps us recommend voice vs. text AI features
                    </FormDescription>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm font-medium px-1">
                          <span className="flex items-center gap-1">📞 Phone</span>
                          <span className="text-muted-foreground">{field.value}% / {100 - field.value}%</span>
                          <span className="flex items-center gap-1">Text 💬</span>
                        </div>
                        <Slider
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          max={100}
                          step={10}
                          className="py-4"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-4 space-y-4">
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full text-lg h-14 font-semibold group hover:scale-[1.02] transition-all"
                >
                  Generate My AI Opportunity Report
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    ✓ Instant results
                  </span>
                  <span className="flex items-center gap-1">
                    ✓ No credit card
                  </span>
                  <span className="flex items-center gap-1">
                    ✓ 100% free
                  </span>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickAssessmentForm;
