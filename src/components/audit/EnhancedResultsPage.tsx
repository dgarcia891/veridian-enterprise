import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GradeCard from "./GradeCard";
import { EnhancedAuditResults } from "@/hooks/useEnhancedAuditCalculation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface EnhancedResultsPageProps {
  companyName: string;
  results: EnhancedAuditResults;
  websiteAnalysis: any;
}

const EnhancedResultsPage = ({ companyName, results, websiteAnalysis }: EnhancedResultsPageProps) => {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getImpactColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-500/20 text-red-500 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      default:
        return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const calculateEstimatedValue = (impact: string) => {
    const totalLostRevenue = results.lostRevenueBreakdown.totalMonthlyLostRevenue;
    const impactMultiplier = {
      'high': 0.25,
      'medium': 0.15,
      'low': 0.08,
    };
    const multiplier = impactMultiplier[impact.toLowerCase() as keyof typeof impactMultiplier] || 0.1;
    return totalLostRevenue * multiplier;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Summary */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your AI Opportunity Report
        </h1>
        <p className="text-xl text-muted-foreground">
          Personalized for {companyName}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Estimated Monthly Traffic</p>
              <p className="text-3xl font-bold text-primary">
                {results.trafficEstimate.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">visitors</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Monthly Lost Revenue</p>
              <p className="text-3xl font-bold text-red-500">
                {formatCurrency(results.lostRevenueBreakdown.totalMonthlyLostRevenue)}
              </p>
              <p className="text-xs text-muted-foreground">in missed opportunities</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Monthly Recovery Potential</p>
              <p className="text-3xl font-bold text-green-500">
                {formatCurrency(results.recoveryCalculations.recoveredMonthlyRevenue)}
              </p>
              <p className="text-xs text-muted-foreground">with AI automation</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">ROI Multiplier</p>
              <p className="text-3xl font-bold text-primary">
                {results.roiMetrics.roiMultiplier.toFixed(1)}x
              </p>
              <p className="text-xs text-muted-foreground">return on investment</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          Your AI Readiness Scores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <GradeCard
            title="Lead Conversion"
            grade={results.grades.leadConversionGrade}
            description="Your ability to convert leads into customers"
          />
          <GradeCard
            title="Contact Access"
            grade={results.grades.contactAccessibilityGrade}
            description="How easy it is for customers to reach you"
          />
          <GradeCard
            title="Automation Readiness"
            grade={results.grades.automationReadinessGrade}
            description="Your potential for AI automation gains"
          />
          <GradeCard
            title="Customer Experience"
            grade={results.grades.customerExperienceGrade}
            description="Quality of your customer journey"
          />
          <GradeCard
            title="AI Impact Potential"
            grade={results.grades.aiImpactPotentialGrade}
            description="Expected revenue impact from AI"
          />
        </div>
        <Card className="glass-card mt-4">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Overall Grade</span>
              <div className="text-4xl font-bold text-primary">
                {results.grades.overallGrade}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic & Revenue Breakdown */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Revenue Opportunity Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Monthly Traffic</p>
              <p className="text-2xl font-bold">{results.trafficEstimate.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Leads Generated</p>
              <p className="text-2xl font-bold">{results.leadsRequired}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Customers Closed</p>
              <p className="text-2xl font-bold">{results.customersFromWeb}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <h4 className="font-semibold">Lost Revenue Sources:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Missed Calls</span>
                <span className="font-semibold text-red-500">
                  {formatCurrency(results.lostRevenueBreakdown.lostFromMissedCalls)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slow Response Time</span>
                <span className="font-semibold text-red-500">
                  {formatCurrency(results.lostRevenueBreakdown.lostFromSlowResponse)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Incomplete Follow-up</span>
                <span className="font-semibold text-red-500">
                  {formatCurrency(results.lostRevenueBreakdown.lostFromFollowup)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">After-Hours Leads</span>
                <span className="font-semibold text-red-500">
                  {formatCurrency(results.lostRevenueBreakdown.lostAfterHours)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">No Chat/Scheduling Options</span>
                <span className="font-semibold text-red-500">
                  {formatCurrency(results.lostRevenueBreakdown.lostNoChat + results.lostRevenueBreakdown.lostNoScheduling)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total Monthly Lost Revenue</span>
              <span className="font-bold text-2xl text-red-500">
                {formatCurrency(results.lostRevenueBreakdown.totalMonthlyLostRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold text-lg text-green-500">With AI Recovery (75%)</span>
              <span className="font-bold text-2xl text-green-500">
                {formatCurrency(results.recoveryCalculations.recoveredMonthlyRevenue)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Opportunities */}
      {websiteAnalysis?.opportunities && websiteAnalysis.opportunities.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI Opportunities Identified
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground italic">
              The following are only estimates and not a guarantee.
            </p>
            <Accordion type="single" collapsible className="w-full">
              {websiteAnalysis.opportunities.map((opp: any, index: number) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>
                    <div className="flex items-center justify-between gap-3 flex-1 pr-4">
                      <div className="flex items-center gap-3">
                        <Badge className={getImpactColor(opp.impact)}>
                          {opp.impact}
                        </Badge>
                        <span className="font-semibold">{opp.title}</span>
                      </div>
                      <span className="text-sm text-green-500 font-semibold">
                        {formatCurrency(calculateEstimatedValue(opp.impact))}/mo
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-4">
                      <p className="text-muted-foreground">{opp.description}</p>
                      {opp.solution && (
                        <p className="text-sm">
                          <span className="font-semibold">AI Solution: </span>
                          {opp.solution}
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="text-xs text-muted-foreground italic border-t border-border pt-4">
              These are estimates given the information provided and industry standards and are not a guarantee of performance or returns.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ROI Summary Card */}
      <Card className="glass-card border-primary/50">
        <CardHeader>
          <CardTitle>Your ROI with AI Automation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Monthly AI Investment</p>
              <p className="text-2xl font-bold">{formatCurrency(results.roiMetrics.monthlyAICost)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Net Gain</p>
              <p className="text-2xl font-bold text-green-500">
                {formatCurrency(results.roiMetrics.monthlyNetGain)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Annual Net Gain</p>
              <p className="text-2xl font-bold text-green-500">
                {formatCurrency(results.roiMetrics.annualNetGain)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ROI Percentage</p>
              <p className="text-2xl font-bold text-primary">
                {results.roiMetrics.roiPercentage.toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="space-y-4">
        <Card className="glass-card bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/50">
          <CardContent className="py-8 text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Transform Your Business?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how our AI packages can help you recover {formatCurrency(results.recoveryCalculations.recoveredMonthlyRevenue)} per month
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/pricing')}
              className="group"
            >
              See AI Packages & Pricing
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Transform your business in 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="py-6 text-center space-y-3">
            <h3 className="text-xl font-semibold">Want to Discuss Your Results?</h3>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/schedule-consultation')}
            >
              Schedule Free Consultation
            </Button>
            <p className="text-sm text-muted-foreground">
              Talk to an AI implementation specialist
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedResultsPage;
