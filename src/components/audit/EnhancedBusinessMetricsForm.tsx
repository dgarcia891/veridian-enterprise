import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EnhancedBusinessMetrics } from "@/hooks/useEnhancedAuditCalculation";
import { CustomerSourceSliders } from "./CustomerSourceSliders";
import { CommunicationPreferenceSlider } from "./CommunicationPreferenceSlider";
import { Save, RotateCcw, HelpCircle } from "lucide-react";

interface EnhancedBusinessMetricsFormProps {
  onSubmit: (metrics: EnhancedBusinessMetrics) => void;
}

const STORAGE_KEY = 'audit-form-progress';
const STORAGE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

const EnhancedBusinessMetricsForm = ({ onSubmit }: EnhancedBusinessMetricsFormProps) => {
  // New simplified fields
  const [totalCustomersPerMonth, setTotalCustomersPerMonth] = useState("");
  const [customerSourceSplit, setCustomerSourceSplit] = useState({
    website: 33,
    phone: 33,
    other: 34
  });
  const [sliderVariant, setSliderVariant] = useState<"option-a" | "option-b" | "option-c">("option-a");
  const [websiteKnowledge, setWebsiteKnowledge] = useState("");
  const [textPhonePreference, setTextPhonePreference] = useState(60);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Original fields
  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState(10);
  const [avgProfitPerCustomer, setAvgProfitPerCustomer] = useState("");
  const [industry, setIndustry] = useState("");
  const [currentCallMethod, setCurrentCallMethod] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Conditional website fields
  const [websiteVisitsPerMonth, setWebsiteVisitsPerMonth] = useState("");
  const [monthlyWebsiteLeads, setMonthlyWebsiteLeads] = useState("");
  const [leadCloseRate, setLeadCloseRate] = useState(30);
  const [visitorLeadConversion, setVisitorLeadConversion] = useState("");

  // Follow-up fields
  const [speedOfFollowup, setSpeedOfFollowup] = useState("");
  const [followupCompletionRate, setFollowupCompletionRate] = useState(70);
  const [afterHoursImportance, setAfterHoursImportance] = useState("");

  const showWebsiteQuestions = websiteKnowledge === "exactly" || websiteKnowledge === "kind-of";

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Date.now() - data.timestamp < STORAGE_EXPIRY) {
          // Restore all fields
          if (data.totalCustomersPerMonth) setTotalCustomersPerMonth(data.totalCustomersPerMonth);
          if (data.customerSourceSplit) setCustomerSourceSplit(data.customerSourceSplit);
          if (data.sliderVariant) setSliderVariant(data.sliderVariant);
          if (data.websiteKnowledge) setWebsiteKnowledge(data.websiteKnowledge);
          if (data.textPhonePreference !== undefined) setTextPhonePreference(data.textPhonePreference);
          if (data.missedCallsPerWeek !== undefined) setMissedCallsPerWeek(data.missedCallsPerWeek);
          if (data.avgProfitPerCustomer) setAvgProfitPerCustomer(data.avgProfitPerCustomer);
          if (data.industry) setIndustry(data.industry);
          if (data.currentCallMethod) setCurrentCallMethod(data.currentCallMethod);
          if (data.websiteUrl) setWebsiteUrl(data.websiteUrl);
          if (data.websiteVisitsPerMonth) setWebsiteVisitsPerMonth(data.websiteVisitsPerMonth);
          if (data.monthlyWebsiteLeads) setMonthlyWebsiteLeads(data.monthlyWebsiteLeads);
          if (data.leadCloseRate !== undefined) setLeadCloseRate(data.leadCloseRate);
          if (data.visitorLeadConversion) setVisitorLeadConversion(data.visitorLeadConversion);
          if (data.speedOfFollowup) setSpeedOfFollowup(data.speedOfFollowup);
          if (data.followupCompletionRate !== undefined) setFollowupCompletionRate(data.followupCompletionRate);
          if (data.afterHoursImportance) setAfterHoursImportance(data.afterHoursImportance);
        } else {
          // Expired, clear it
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
        totalCustomersPerMonth,
        customerSourceSplit,
        sliderVariant,
        websiteKnowledge,
        textPhonePreference,
        missedCallsPerWeek,
        avgProfitPerCustomer,
        industry,
        currentCallMethod,
        websiteUrl,
        websiteVisitsPerMonth,
        monthlyWebsiteLeads,
        leadCloseRate,
        visitorLeadConversion,
        speedOfFollowup,
        followupCompletionRate,
        afterHoursImportance,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setLastSaved(new Date());
    }, 500);

    return () => clearTimeout(timer);
  }, [
    totalCustomersPerMonth, customerSourceSplit, sliderVariant, websiteKnowledge, 
    textPhonePreference, missedCallsPerWeek, avgProfitPerCustomer, industry, 
    currentCallMethod, websiteUrl, websiteVisitsPerMonth, monthlyWebsiteLeads, 
    leadCloseRate, visitorLeadConversion, speedOfFollowup, followupCompletionRate, 
    afterHoursImportance
  ]);

  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

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
    
    const totalCustomers = parseInt(totalCustomersPerMonth);
    const customersFromWebsite = Math.round(totalCustomers * (customerSourceSplit.website / 100));
    const customersFromPhone = Math.round(totalCustomers * (customerSourceSplit.phone / 100));
    const customersFromOther = Math.round(totalCustomers * (customerSourceSplit.other / 100));
    
    const textPreference = textPhonePreference;
    const phonePreference = 100 - textPhonePreference;

    onSubmit({
      // NEW fields
      totalCustomersPerMonth: totalCustomers,
      customerSourceSplit,
      websiteKnowledge: websiteKnowledge as "exactly" | "kind-of" | "no-idea",
      textPreference,
      phonePreference,
      
      // Calculated values
      customersFromWebsite,
      customersFromPhone,
      customersFromOther,
      messagingPreferenceRate: textPreference,
      
      // Conditional website fields
      monthlyWebsiteVisits: showWebsiteQuestions ? (websiteVisitsPerMonth ? parseInt(websiteVisitsPerMonth) : undefined) : undefined,
      monthlyWebsiteLeads: showWebsiteQuestions ? parseInt(monthlyWebsiteLeads) : 0,
      leadCloseRate: showWebsiteQuestions ? leadCloseRate : 30,
      visitorLeadConversion: showWebsiteQuestions ? visitorLeadConversion : "medium",
      
      // Other fields
      missedCallsPerWeek,
      avgProfitPerCustomer: parseFloat(avgProfitPerCustomer),
      industry,
      currentCallMethod,
      websiteUrl: normalizeUrl(websiteUrl),
      speedOfFollowup,
      followupCompletionRate,
      afterHoursImportance,
    });
    
    // Clear saved progress after successful submit
    localStorage.removeItem(STORAGE_KEY);
  };

  const isValid = 
    totalCustomersPerMonth && 
    customerSourceSplit.website + customerSourceSplit.phone + customerSourceSplit.other === 100 &&
    avgProfitPerCustomer && 
    industry && 
    currentCallMethod && 
    websiteUrl && 
    websiteKnowledge && 
    (!showWebsiteQuestions || (monthlyWebsiteLeads && visitorLeadConversion)) &&
    speedOfFollowup && 
    afterHoursImportance;

  const totalCustomers = parseInt(totalCustomersPerMonth) || 0;
  const completionPercent = Math.round(
    ([
      totalCustomersPerMonth,
      avgProfitPerCustomer,
      websiteKnowledge,
      industry,
      currentCallMethod,
      websiteUrl,
      speedOfFollowup,
      afterHoursImportance,
      !showWebsiteQuestions || (monthlyWebsiteLeads && visitorLeadConversion),
    ].filter(Boolean).length / 9) * 100
  );

  return (
    <TooltipProvider>
      <Card className="glass-card">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          AI Website ROI Audit
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          Discover your AI opportunity in under 3 minutes
        </CardDescription>
        
        {lastSaved && (
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
            <Save className="w-3 h-3" />
            <span>Progress saved {lastSaved.toLocaleTimeString()}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearProgress}
              className="h-6 px-2 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dev Tool: Slider Variant Switcher */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <Label className="text-sm font-medium mb-2 block">Test Slider Variants:</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={sliderVariant === "option-a" ? "default" : "outline"}
                size="sm"
                onClick={() => setSliderVariant("option-a")}
              >
                Option A
              </Button>
              <Button
                type="button"
                variant={sliderVariant === "option-b" ? "default" : "outline"}
                size="sm"
                onClick={() => setSliderVariant("option-b")}
              >
                Option B
              </Button>
              <Button
                type="button"
                variant={sliderVariant === "option-c" ? "default" : "outline"}
                size="sm"
                onClick={() => setSliderVariant("option-c")}
              >
                Option C
              </Button>
            </div>
          </div>

          {/* Section 1: Business Overview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              📊 Business Overview
            </h3>

            <div className="space-y-2">
              <Label htmlFor="total-customers" className="text-base flex items-center gap-2">
                How many new customers do you get each month? *
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>This includes all new paying customers who sign up or purchase from your business each month, regardless of how they found you.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="total-customers"
                type="number"
                placeholder="e.g., 30"
                value={totalCustomersPerMonth}
                onChange={(e) => setTotalCustomersPerMonth(e.target.value)}
                min="0"
                step="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base flex items-center gap-2">
                Where do your customers come from?
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Estimate what percentage of your customers find you through your website, phone calls, or other sources (referrals, walk-ins, social media, etc.)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <CustomerSourceSliders
                value={customerSourceSplit}
                onChange={setCustomerSourceSplit}
                totalCustomers={totalCustomers}
                variant={sliderVariant}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profit" className="text-base flex items-center gap-2">
                What's the average you make per customer? *
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>The average total revenue (in dollars) you earn from each customer. This helps us calculate your potential lost revenue.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="profit"
                type="number"
                placeholder="e.g., 2500"
                value={avgProfitPerCustomer}
                onChange={(e) => setAvgProfitPerCustomer(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Section 2: Website Performance */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              🌐 Website Performance
            </h3>

            <div className="space-y-3">
              <Label className="text-base flex items-center gap-2">
                Do you track your website numbers? *
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Do you know things like how many people visit your site and how many contact you? This helps us give you more accurate recommendations.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                  <Label htmlFor="website-visits" className="text-base flex items-center gap-2">
                    How many people visit your website each month? *
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>The total number of visits to your website per month. You can find this in Google Analytics or similar tools.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="website-visits"
                    type="number"
                    placeholder="e.g., 1000"
                    value={websiteVisitsPerMonth}
                    onChange={(e) => setWebsiteVisitsPerMonth(e.target.value)}
                    min="0"
                    step="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website-leads" className="text-base flex items-center gap-2">
                    How many people contact you from your website each month? *
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Count all inquiries: form submissions, chat messages, phone calls, or emails from website visitors wanting more information.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="website-leads"
                    type="number"
                    placeholder="e.g., 50"
                    value={monthlyWebsiteLeads}
                    onChange={(e) => setMonthlyWebsiteLeads(e.target.value)}
                    min="0"
                    step="1"
                    required={showWebsiteQuestions}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="close-rate" className="text-base flex items-center gap-2">
                    What percentage of inquiries become paying customers?
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Of all the people who inquire about your service, what percentage actually become customers? For example, if 10 people ask about your service and 3 buy, that's 30%.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="space-y-4">
                    <Slider
                      id="close-rate"
                      value={[leadCloseRate]}
                      onValueChange={(value) => setLeadCloseRate(value[0])}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center">
                      <span className="text-2xl font-bold text-primary">{leadCloseRate}%</span>
                      <p className="text-sm text-muted-foreground">You convert {leadCloseRate}% of inquiries into customers</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conversion-quality" className="text-base flex items-center gap-2">
                    How well does your website turn visitors into contacts? *
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Of all your website visitors, what percentage actually contact you? High means 5+ out of every 100 visitors reach out.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Select value={visitorLeadConversion} onValueChange={setVisitorLeadConversion} required={showWebsiteQuestions}>
                    <SelectTrigger id="conversion-quality">
                      <SelectValue placeholder="Select how well your website converts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High (5+ out of 100 visitors contact you)</SelectItem>
                      <SelectItem value="medium">Medium (2-5 out of 100 contact you)</SelectItem>
                      <SelectItem value="low">Low (1-2 out of 100 contact you)</SelectItem>
                      <SelectItem value="very-low">Very Low (less than 1 out of 100)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {websiteKnowledge === "no-idea" && (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 animate-fade-in">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✓ No problem! We'll estimate based on industry standards.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Response & Follow-up */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              ⚡ Response & Follow-up
            </h3>

            <div className="space-y-2">
              <Label htmlFor="missed-calls" className="text-base flex items-center gap-2">
                Missed calls per week
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>How many phone calls do you typically miss each week because you're busy, closed, or can't answer the phone?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="space-y-4">
                <Slider
                  id="missed-calls"
                  value={[missedCallsPerWeek]}
                  onValueChange={(value) => setMissedCallsPerWeek(value[0])}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary">{missedCallsPerWeek}</span>
                  <span className="text-muted-foreground ml-2">calls/week</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="followup-speed" className="text-base flex items-center gap-2">
                How quickly do you respond to new inquiries? *
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>When someone reaches out (calls, emails, or fills out a form), how fast do you typically get back to them?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select value={speedOfFollowup} onValueChange={setSpeedOfFollowup} required>
                <SelectTrigger id="followup-speed">
                  <SelectValue placeholder="Select your typical response time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="within-5min">Within 5 minutes</SelectItem>
                  <SelectItem value="within-1hr">Within 1 hour</SelectItem>
                  <SelectItem value="within-4hrs">Within 4 hours</SelectItem>
                  <SelectItem value="within-24hrs">Within 24 hours</SelectItem>
                  <SelectItem value="slower">Slower than 24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="followup-rate" className="text-base flex items-center gap-2">
                How often do you follow up with everyone who contacts you?
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>What percentage of people who reach out actually get a response from you? 100% means everyone gets followed up with.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="space-y-4">
                <Slider
                  id="followup-rate"
                  value={[followupCompletionRate]}
                  onValueChange={(value) => setFollowupCompletionRate(value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary">{followupCompletionRate}%</span>
                  <p className="text-sm text-muted-foreground">You respond to {followupCompletionRate}% of all inquiries</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Customer Preferences */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              💬 Customer Preferences
            </h3>

            <CommunicationPreferenceSlider
              value={textPhonePreference}
              onChange={setTextPhonePreference}
            />

            <div className="space-y-2">
              <Label htmlFor="after-hours" className="text-base flex items-center gap-2">
                How important is it to respond outside business hours? *
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Do you lose potential customers if you can't respond to inquiries in the evenings, weekends, or holidays?</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select value={afterHoursImportance} onValueChange={setAfterHoursImportance} required>
                <SelectTrigger id="after-hours">
                  <SelectValue placeholder="How much does this matter?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical - I lose many potential customers</SelectItem>
                  <SelectItem value="important">Important - I lose some potential customers</SelectItem>
                  <SelectItem value="moderate">Moderate - It matters but not a deal-breaker</SelectItem>
                  <SelectItem value="minimal">Minimal - Most customers can wait</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 5: Company Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              🏢 Company Details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-base">
                Your website URL *
              </Label>
              <Input
                id="website"
                type="text"
                placeholder="yourwebsite.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                We'll analyze your website to provide personalized AI recommendations
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-base">
                Industry *
              </Label>
              <Select value={industry} onValueChange={setIndustry} required>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="home-services">Home Services</SelectItem>
                  <SelectItem value="medical">Medical/Healthcare</SelectItem>
                  <SelectItem value="legal">Legal Services</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="restaurants">Restaurants</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="professional-services">Professional Services</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="call-method" className="text-base">
                How do you currently handle calls? *
              </Label>
              <Select value={currentCallMethod} onValueChange={setCurrentCallMethod} required>
                <SelectTrigger id="call-method">
                  <SelectValue placeholder="Select your method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="answer-myself">Answer all calls myself</SelectItem>
                  <SelectItem value="receptionist">Have a receptionist</SelectItem>
                  <SelectItem value="voicemail">Voicemail only</SelectItem>
                  <SelectItem value="mix">Mix of methods</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Form completion</span>
              <span className="font-medium text-primary">{completionPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full"
            disabled={!isValid}
          >
            Continue to Results
          </Button>
        </form>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};

export default EnhancedBusinessMetricsForm;
