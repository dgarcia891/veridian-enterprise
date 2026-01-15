import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EnhancedBusinessMetrics } from "@/hooks/useEnhancedAuditCalculation";
import { Save, HelpCircle, Sparkles, CheckCircle, AlertTriangle, ArrowRight, Mail, User, Phone } from "lucide-react";
import { QuickAssessmentData } from "./QuickAssessmentForm";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useToast } from "@/hooks/use-toast";

interface EnhancedBusinessMetricsFormProps {
  onSubmit: (metrics: EnhancedBusinessMetrics) => void;
  onBackgroundAnalysis?: (analysis: any) => void;
  quickAssessmentData?: QuickAssessmentData;
  prefilledMissedCalls?: number;
  prefilledIndustry?: string;
}

interface ContactCaptureFormProps {
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
  isLoading: boolean;
}

const STORAGE_KEY = 'audit-form-progress';
const STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

const EnhancedBusinessMetricsForm = ({
  onSubmit,
  onBackgroundAnalysis,
  quickAssessmentData,
  prefilledMissedCalls,
  prefilledIndustry
}: EnhancedBusinessMetricsFormProps) => {
  // Priority fields
  const [websiteUrl, setWebsiteUrl] = useState(quickAssessmentData?.websiteUrl || "");
  const [totalCustomersPerMonth, setTotalCustomersPerMonth] = useState("");
  const [avgProfitPerCustomer, setAvgProfitPerCustomer] = useState("");

  // Website analytics
  const [websiteKnowledge, setWebsiteKnowledge] = useState("");
  const [websiteVisitsPerMonth, setWebsiteVisitsPerMonth] = useState("");
  const [monthlyWebsiteLeads, setMonthlyWebsiteLeads] = useState("");
  const [visitorLeadConversion, setVisitorLeadConversion] = useState("");

  // Call handling
  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState(prefilledMissedCalls || 10);
  const [followupCompletionRate, setFollowupCompletionRate] = useState(70);
  const [currentCallMethod, setCurrentCallMethod] = useState("");

  // Customer sources - simplified to buttons
  const [customerSource, setCustomerSource] = useState<"mostly-website" | "mostly-phone" | "about-even" | "not-sure" | "">("");

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasTriggeredBackgroundScan, setHasTriggeredBackgroundScan] = useState(false);
  const { trackEvent, trackCTAClick } = useAnalytics();

  const showWebsiteQuestions = websiteKnowledge === "exactly" || websiteKnowledge === "kind-of";
  const hasWebsite = quickAssessmentData?.hasWebsite === "yes";
  const industry = prefilledIndustry || quickAssessmentData?.industry || "";

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Date.now() - data.timestamp < STORAGE_EXPIRY) {
          if (data.websiteUrl) setWebsiteUrl(data.websiteUrl);
          if (data.totalCustomersPerMonth) setTotalCustomersPerMonth(data.totalCustomersPerMonth);
          if (data.avgProfitPerCustomer) setAvgProfitPerCustomer(data.avgProfitPerCustomer);
          if (data.websiteKnowledge) setWebsiteKnowledge(data.websiteKnowledge);
          if (data.websiteVisitsPerMonth) setWebsiteVisitsPerMonth(data.websiteVisitsPerMonth);
          if (data.monthlyWebsiteLeads) setMonthlyWebsiteLeads(data.monthlyWebsiteLeads);
          if (data.visitorLeadConversion) setVisitorLeadConversion(data.visitorLeadConversion);
          if (data.missedCallsPerWeek !== undefined) setMissedCallsPerWeek(data.missedCallsPerWeek);
          if (data.followupCompletionRate !== undefined) setFollowupCompletionRate(data.followupCompletionRate);
          if (data.currentCallMethod) setCurrentCallMethod(data.currentCallMethod);
          if (data.customerSource) setCustomerSource(data.customerSource);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  // Save progress on field changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const formData = {
        websiteUrl,
        totalCustomersPerMonth,
        avgProfitPerCustomer,
        websiteKnowledge,
        websiteVisitsPerMonth,
        monthlyWebsiteLeads,
        visitorLeadConversion,
        missedCallsPerWeek,
        followupCompletionRate,
        currentCallMethod,
        customerSource,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setLastSaved(new Date());
    }, 500);

    return () => clearTimeout(timer);
  }, [
    websiteUrl, totalCustomersPerMonth, avgProfitPerCustomer, websiteKnowledge,
    websiteVisitsPerMonth, monthlyWebsiteLeads, visitorLeadConversion,
    missedCallsPerWeek, followupCompletionRate, currentCallMethod, customerSource
  ]);

  // Trigger background website analysis when URL is filled
  useEffect(() => {
    const triggerBackgroundAnalysis = async () => {
      if (websiteUrl && industry && !hasTriggeredBackgroundScan && onBackgroundAnalysis) {
        setHasTriggeredBackgroundScan(true);

        try {
          const normalizedUrl = normalizeUrl(websiteUrl);
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-website`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ websiteUrl: normalizedUrl, industry }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            onBackgroundAnalysis(data.analysis);
          }
        } catch (error) {
          console.log('Background analysis failed, will retry on submit');
        }
      }
    };

    triggerBackgroundAnalysis();
  }, [websiteUrl, industry, hasTriggeredBackgroundScan, onBackgroundAnalysis]);

  const normalizeUrl = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return trimmed;
    if (!trimmed.match(/^https?:\/\//i)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert customer source to percentages
    const customerSourceSplit = (() => {
      switch (customerSource) {
        case "mostly-website": return { website: 70, phone: 20, other: 10 };
        case "mostly-phone": return { website: 20, phone: 70, other: 10 };
        case "about-even": return { website: 45, phone: 45, other: 10 };
        case "not-sure": return { website: 33, phone: 33, other: 34 };
        default: return { website: 33, phone: 33, other: 34 };
      }
    })();

    const totalCustomers = parseInt(totalCustomersPerMonth) || 0;
    const customersFromWebsite = Math.round(totalCustomers * (customerSourceSplit.website / 100));
    const customersFromPhone = Math.round(totalCustomers * (customerSourceSplit.phone / 100));
    const customersFromOther = Math.round(totalCustomers * (customerSourceSplit.other / 100));

    // Get pre-filled data from quick assessment
    const textPreference = 100 - (quickAssessmentData?.communicationPreference || 50);
    const phonePreference = quickAssessmentData?.communicationPreference || 50;

    // Track Intent
    trackCTAClick("Generate My Complete AI Report", "Enhanced Metrics Form");

    // Track Success
    trackEvent("audit_step_success", {
      category: "engagement",
      metadata: { step: "enhanced_metrics", industry }
    });

    onSubmit({
      // NEW fields
      totalCustomersPerMonth: totalCustomers,
      customerSourceSplit,
      websiteKnowledge: websiteKnowledge as "exactly" | "kind-of" | "no-idea" || "no-idea",
      textPreference,
      phonePreference,

      // Calculated values
      customersFromWebsite,
      customersFromPhone,
      customersFromOther,
      messagingPreferenceRate: textPreference,

      // Conditional website fields
      monthlyWebsiteVisits: showWebsiteQuestions ? (websiteVisitsPerMonth ? parseInt(websiteVisitsPerMonth) : undefined) : undefined,
      monthlyWebsiteLeads: showWebsiteQuestions ? (monthlyWebsiteLeads ? parseInt(monthlyWebsiteLeads) : 0) : 0,
      leadCloseRate: 30, // Default value
      visitorLeadConversion: showWebsiteQuestions ? (visitorLeadConversion || "medium") : "medium",

      // Other fields
      missedCallsPerWeek,
      avgProfitPerCustomer: parseFloat(avgProfitPerCustomer) || 0,
      industry,
      currentCallMethod: currentCallMethod || "Unknown",
      websiteUrl: normalizeUrl(websiteUrl),
      speedOfFollowup: quickAssessmentData?.responseTime || "24hrs",
      followupCompletionRate,
      afterHoursImportance: quickAssessmentData?.afterHoursImportance || "moderate",
    });

    // Clear saved progress after successful submit
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TooltipProvider>
      <Card className="glass-card">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Almost Done! These Details Will Make Your Report Even More Accurate
          </CardTitle>
          <CardDescription className="text-base">
            All questions optional - we'll estimate anything you skip
          </CardDescription>

          {lastSaved && (
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
              <Save className="w-3 h-3" />
              <span>Progress saved {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="w-4 h-4" />
            <span>Final Section - Skip any you don't know</span>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Revenue & Scale */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                📊 Revenue & Scale
              </h3>

              {hasWebsite && (
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-base">
                    Website URL
                  </Label>
                  <Input
                    id="website"
                    type="text"
                    placeholder="yourwebsite.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    So we can find AI opportunities specific to your site
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="total-customers" className="text-base flex items-center gap-2">
                  New customers per month
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Your best guess is fine - helps us calculate ROI</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="total-customers"
                  type="number"
                  placeholder="e.g., 30"
                  value={totalCustomersPerMonth}
                  onChange={(e) => setTotalCustomersPerMonth(e.target.value)}
                  min="0"
                  step="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profit" className="text-base flex items-center gap-2">
                  Average revenue per customer
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Helps us calculate your ROI - or skip if you prefer</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="profit"
                  type="number"
                  placeholder="e.g., 2500"
                  value={avgProfitPerCustomer}
                  onChange={(e) => setAvgProfitPerCustomer(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base flex items-center gap-2">
                  Where do customers come from?
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Your best estimate - helps us prioritize recommendations</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "mostly-website" as const, label: "Mostly Website", icon: "🌐" },
                    { value: "mostly-phone" as const, label: "Mostly Phone", icon: "📞" },
                    { value: "about-even" as const, label: "About Even", icon: "⚖️" },
                    { value: "not-sure" as const, label: "Not Sure", icon: "🤷" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={customerSource === option.value ? "default" : "outline"}
                      className="h-auto py-4 flex flex-col items-center gap-2"
                      onClick={() => setCustomerSource(option.value)}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-sm">{option.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground py-2">
              <Sparkles className="w-4 h-4 inline mr-2" />
              Great! Almost there...
            </div>

            {/* Section 2: Website Analytics */}
            {hasWebsite && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  🌐 Website Analytics
                </h3>

                <div className="space-y-3">
                  <Label className="text-base flex items-center gap-2">
                    Do you track website numbers?
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Helps us give more accurate recommendations</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <RadioGroup value={websiteKnowledge} onValueChange={setWebsiteKnowledge}>
                    <div className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="exactly" id="exactly" className="mt-1" />
                      <Label htmlFor="exactly" className="flex-1 cursor-pointer">
                        <p className="font-medium">I know exactly</p>
                        <p className="text-sm text-muted-foreground">I have analytics data</p>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="kind-of" id="kind-of" className="mt-1" />
                      <Label htmlFor="kind-of" className="flex-1 cursor-pointer">
                        <p className="font-medium">I know kind of</p>
                        <p className="text-sm text-muted-foreground">I have rough estimates</p>
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="no-idea" id="no-idea" className="mt-1" />
                      <Label htmlFor="no-idea" className="flex-1 cursor-pointer">
                        <p className="font-medium">I have no idea</p>
                        <p className="text-sm text-muted-foreground">Skip these questions</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {showWebsiteQuestions && (
                  <div className="space-y-4 animate-fade-in pl-4 border-l-2 border-primary">
                    <div className="space-y-2">
                      <Label htmlFor="website-visits" className="text-base">
                        Monthly website visitors
                      </Label>
                      <Input
                        id="website-visits"
                        type="number"
                        placeholder="e.g., 1000"
                        value={websiteVisitsPerMonth}
                        onChange={(e) => setWebsiteVisitsPerMonth(e.target.value)}
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website-leads" className="text-base">
                        Monthly inquiries from website
                      </Label>
                      <Input
                        id="website-leads"
                        type="number"
                        placeholder="e.g., 50"
                        value={monthlyWebsiteLeads}
                        onChange={(e) => setMonthlyWebsiteLeads(e.target.value)}
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">
                        How well does your website convert visitors?
                      </Label>
                      <RadioGroup value={visitorLeadConversion} onValueChange={setVisitorLeadConversion}>
                        <div className="space-y-2">
                          {[
                            { value: "high", label: "High", desc: "Most visitors contact us" },
                            { value: "medium", label: "Medium", desc: "Some contact us" },
                            { value: "low", label: "Low", desc: "Few contact us" },
                            { value: "very-low", label: "Very Low", desc: "Almost none contact us" },
                          ].map((option) => (
                            <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border-2 hover:border-primary cursor-pointer transition-colors">
                              <RadioGroupItem value={option.value} id={`conv-${option.value}`} className="mt-1" />
                              <Label htmlFor={`conv-${option.value}`} className="flex-1 cursor-pointer">
                                <p className="font-medium">{option.label}</p>
                                <p className="text-sm text-muted-foreground">{option.desc}</p>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 3: Call Handling Details */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                ⚡ Call Handling Details
              </h3>

              <div className="space-y-2">
                <Label htmlFor="missed-calls" className="text-base flex items-center gap-2">
                  Missed calls per week
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Your best guess is fine</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="missed-calls"
                  type="number"
                  placeholder="e.g., 10"
                  value={missedCallsPerWeek}
                  onChange={(e) => setMissedCallsPerWeek(parseInt(e.target.value) || 0)}
                  min="0"
                />
                {prefilledMissedCalls && (
                  <p className="text-sm text-muted-foreground">
                    Based on your earlier answer, we estimate ~{prefilledMissedCalls} calls/week. Adjust if needed.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base">
                  Follow-up completion rate
                </Label>
                <p className="text-sm text-muted-foreground">Your best guess is fine</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-medium px-1">
                    <span>Never</span>
                    <span className="text-primary font-bold">{followupCompletionRate}%</span>
                    <span>Always</span>
                  </div>
                  <Slider
                    value={[followupCompletionRate]}
                    onValueChange={(value) => setFollowupCompletionRate(value[0])}
                    max={100}
                    step={5}
                    className="py-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">
                  How do you currently handle calls?
                </Label>
                <RadioGroup value={currentCallMethod} onValueChange={setCurrentCallMethod}>
                  <div className="space-y-2">
                    {[
                      { value: "Owner", label: "I answer everything myself" },
                      { value: "Staff", label: "Staff answers calls" },
                      { value: "Answering Service", label: "Answering service" },
                      { value: "Voicemail", label: "Voicemail only" },
                      { value: "Other", label: "Other / Mixed" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg border-2 hover:border-primary cursor-pointer transition-colors">
                        <RadioGroupItem value={option.value} id={`method-${option.value}`} />
                        <Label htmlFor={`method-${option.value}`} className="flex-1 cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 space-y-4">
              <div className="text-center text-sm text-muted-foreground mb-4">
                <Sparkles className="w-4 h-4 inline mr-2" />
                You're about to see exactly how much revenue AI could recover
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg h-14 font-semibold"
              >
                Generate My Complete AI Report
              </Button>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>✓ Instant results</span>
                <span>✓ No credit card</span>
                <span>✓ 100% free</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EnhancedBusinessMetricsForm;
