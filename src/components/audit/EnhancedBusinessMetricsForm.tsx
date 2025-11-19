import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EnhancedBusinessMetrics } from "@/hooks/useEnhancedAuditCalculation";

interface EnhancedBusinessMetricsFormProps {
  onSubmit: (metrics: EnhancedBusinessMetrics) => void;
}

const EnhancedBusinessMetricsForm = ({ onSubmit }: EnhancedBusinessMetricsFormProps) => {
  // Original fields
  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState(10);
  const [avgProfitPerCustomer, setAvgProfitPerCustomer] = useState("");
  const [industry, setIndustry] = useState("");
  const [currentCallMethod, setCurrentCallMethod] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteVisitsPerMonth, setWebsiteVisitsPerMonth] = useState("");
  const [clientsPerMonth, setClientsPerMonth] = useState("");

  // New fields
  const [newCustomersPerMonth, setNewCustomersPerMonth] = useState("");
  const [percentFromWebsite, setPercentFromWebsite] = useState(50);
  const [monthlyWebsiteLeads, setMonthlyWebsiteLeads] = useState("");
  const [leadCloseRate, setLeadCloseRate] = useState(30);
  const [visitorLeadConversion, setVisitorLeadConversion] = useState("");
  const [speedOfFollowup, setSpeedOfFollowup] = useState("");
  const [followupCompletionRate, setFollowupCompletionRate] = useState(70);
  const [messagingPreferenceRate, setMessagingPreferenceRate] = useState(40);
  const [afterHoursImportance, setAfterHoursImportance] = useState("");

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
    
    if (!avgProfitPerCustomer || !industry || !currentCallMethod || !websiteUrl || 
        !clientsPerMonth || !newCustomersPerMonth || !monthlyWebsiteLeads || 
        !visitorLeadConversion || !speedOfFollowup || !afterHoursImportance) {
      return;
    }

    onSubmit({
      missedCallsPerWeek,
      avgProfitPerCustomer: parseFloat(avgProfitPerCustomer),
      industry,
      currentCallMethod,
      websiteUrl: normalizeUrl(websiteUrl),
      websiteVisitsPerMonth: websiteVisitsPerMonth ? parseInt(websiteVisitsPerMonth) : undefined,
      clientsPerMonth: parseInt(clientsPerMonth),
      newCustomersPerMonth: parseInt(newCustomersPerMonth),
      percentFromWebsite,
      monthlyWebsiteLeads: parseInt(monthlyWebsiteLeads),
      leadCloseRate,
      visitorLeadConversion,
      speedOfFollowup,
      followupCompletionRate,
      messagingPreferenceRate,
      afterHoursImportance,
    });
  };

  const isValid = avgProfitPerCustomer && industry && currentCallMethod && websiteUrl && 
                  clientsPerMonth && newCustomersPerMonth && monthlyWebsiteLeads && 
                  visitorLeadConversion && speedOfFollowup && afterHoursImportance;

  return (
    <Card className="glass-card">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          AI Website ROI Audit
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          Discover your AI opportunity in under 3 minutes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Overview */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Business Overview</h3>
            
            <div className="space-y-2">
              <Label htmlFor="new-customers" className="text-base">
                New customers per month *
              </Label>
              <Input
                id="new-customers"
                type="number"
                placeholder="e.g., 15"
                value={newCustomersPerMonth}
                onChange={(e) => setNewCustomersPerMonth(e.target.value)}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percent-from-website" className="text-base">
                Percent of customers from website: {percentFromWebsite}%
              </Label>
              <Slider
                id="percent-from-website"
                value={[percentFromWebsite]}
                onValueChange={(value) => setPercentFromWebsite(value[0])}
                min={0}
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-leads" className="text-base">
                Monthly website leads (inquiries/contacts) *
              </Label>
              <Input
                id="monthly-leads"
                type="number"
                placeholder="e.g., 50"
                value={monthlyWebsiteLeads}
                onChange={(e) => setMonthlyWebsiteLeads(e.target.value)}
                min="0"
                required
              />
              <p className="text-sm text-muted-foreground">How many inquiries or contacts do you get per month?</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="close-rate" className="text-base">
                Lead-to-customer close rate: {leadCloseRate}%
              </Label>
              <Slider
                id="close-rate"
                value={[leadCloseRate]}
                onValueChange={(value) => setLeadCloseRate(value[0])}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-sm text-muted-foreground">You close {leadCloseRate}% of leads</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conversion-quality" className="text-base">
                Visitor-to-lead conversion quality *
              </Label>
              <Select value={visitorLeadConversion} onValueChange={setVisitorLeadConversion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select conversion quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (5%+)</SelectItem>
                  <SelectItem value="medium">Medium (2-5%)</SelectItem>
                  <SelectItem value="low">Low (1-2%)</SelectItem>
                  <SelectItem value="very-low">Very Low (&lt;1%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profit" className="text-base">
                Average revenue per customer ($) *
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

          {/* Communication & Follow-up */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Communication & Follow-up</h3>

            <div className="space-y-2">
              <Label htmlFor="missed-calls" className="text-base">
                Missed calls per week: {missedCallsPerWeek}
              </Label>
              <Slider
                id="missed-calls"
                value={[missedCallsPerWeek]}
                onValueChange={(value) => setMissedCallsPerWeek(value[0])}
                min={0}
                max={50}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="followup-speed" className="text-base">
                Speed of follow-up *
              </Label>
              <Select value={speedOfFollowup} onValueChange={setSpeedOfFollowup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select follow-up speed" />
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
              <Label htmlFor="followup-rate" className="text-base">
                Follow-up completion rate: {followupCompletionRate}%
              </Label>
              <Slider
                id="followup-rate"
                value={[followupCompletionRate]}
                onValueChange={(value) => setFollowupCompletionRate(value[0])}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-sm text-muted-foreground">You follow up with {followupCompletionRate}% of leads</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="messaging-preference" className="text-base">
                Messaging preference rate: {messagingPreferenceRate}%
              </Label>
              <Slider
                id="messaging-preference"
                value={[messagingPreferenceRate]}
                onValueChange={(value) => setMessagingPreferenceRate(value[0])}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-sm text-muted-foreground">{messagingPreferenceRate}% of customers prefer text/chat over calls</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="after-hours" className="text-base">
                After-hours importance *
              </Label>
              <Select value={afterHoursImportance} onValueChange={setAfterHoursImportance}>
                <SelectTrigger>
                  <SelectValue placeholder="Select importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical - lose many leads</SelectItem>
                  <SelectItem value="important">Important - lose some leads</SelectItem>
                  <SelectItem value="moderate">Moderate - occasional loss</SelectItem>
                  <SelectItem value="not-important">Not important</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Company Details</h3>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-base">
                Website URL *
              </Label>
              <Input
                id="website"
                type="text"
                placeholder="example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website-visits" className="text-base">
                Website visits per month (optional)
              </Label>
              <Input
                id="website-visits"
                type="number"
                placeholder="e.g., 5000"
                value={websiteVisitsPerMonth}
                onChange={(e) => setWebsiteVisitsPerMonth(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clients-per-month" className="text-base">
                Total clients/purchases per month *
              </Label>
              <Input
                id="clients-per-month"
                type="number"
                placeholder="e.g., 20"
                value={clientsPerMonth}
                onChange={(e) => setClientsPerMonth(e.target.value)}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-base">
                Industry *
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="home-services">Home Services</SelectItem>
                  <SelectItem value="medical">Medical / Healthcare</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
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
                Current call handling method *
              </Label>
              <Select value={currentCallMethod} onValueChange={setCurrentCallMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="answer-myself">I answer myself</SelectItem>
                  <SelectItem value="voicemail">Voicemail only</SelectItem>
                  <SelectItem value="receptionist">Human receptionist</SelectItem>
                  <SelectItem value="answering-service">Answering service</SelectItem>
                  <SelectItem value="mix">Mix of methods</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!isValid}
          >
            Analyze My Website ROI
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedBusinessMetricsForm;
