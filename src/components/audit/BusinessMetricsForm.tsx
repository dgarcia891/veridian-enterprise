import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BusinessMetrics } from "@/pages/AIAudit";

interface BusinessMetricsFormProps {
  onSubmit: (metrics: BusinessMetrics) => void;
}

const BusinessMetricsForm = ({ onSubmit }: BusinessMetricsFormProps) => {
  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState(10);
  const [avgProfitPerCustomer, setAvgProfitPerCustomer] = useState("");
  const [industry, setIndustry] = useState("");
  const [currentCallMethod, setCurrentCallMethod] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!avgProfitPerCustomer || !industry || !currentCallMethod || !websiteUrl) {
      return;
    }

    onSubmit({
      missedCallsPerWeek,
      avgProfitPerCustomer: parseFloat(avgProfitPerCustomer),
      industry,
      currentCallMethod,
      websiteUrl,
    });
  };

  const isValid = avgProfitPerCustomer && industry && currentCallMethod && websiteUrl;

  return (
    <Card className="glass-card">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Free AI Readiness Audit
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          Discover how AI voice agents can transform your business in under 2 minutes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="missed-calls" className="text-base">
              How many calls do you miss per week?
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
            <Label htmlFor="profit" className="text-base">
              Average profit per customer ($)
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

          <div className="space-y-2">
            <Label htmlFor="website" className="text-base">
              Your website URL
            </Label>
            <Input
              id="website"
              type="url"
              placeholder="https://yourwebsite.com"
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
              What industry are you in?
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
              How do you currently handle calls?
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
  );
};

export default BusinessMetricsForm;
