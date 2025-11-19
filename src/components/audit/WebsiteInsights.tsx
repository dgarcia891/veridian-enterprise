import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Lightbulb, AlertTriangle, FileText, CheckCircle, DollarSign } from "lucide-react";
import { formatCurrency } from "@/hooks/useROICalculation";

interface Opportunity {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  implementation: string;
}

interface ExperienceGap {
  issue: string;
  impact: string;
  solution: string;
}

interface ContentInsight {
  area: string;
  observation: string;
  recommendation: string;
}

interface WebsiteInsightsProps {
  opportunities: Opportunity[];
  experienceGaps: ExperienceGap[];
  contentInsights: ContentInsight[];
  missedCallsPerWeek: number;
  avgProfitPerCustomer: number;
}

const WebsiteInsights = ({ opportunities, experienceGaps, contentInsights, missedCallsPerWeek, avgProfitPerCustomer }: WebsiteInsightsProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted";
    }
  };

  const calculateEstimatedLoss = (impact: "high" | "medium" | "low") => {
    const callbackRate = 0.15;
    const workingDaysPerWeek = 5;
    const missedCallsPerDay = missedCallsPerWeek / workingDaysPerWeek;
    const dailyPotentialLoss = missedCallsPerDay * avgProfitPerCustomer * (1 - callbackRate);
    
    // Calculate monthly loss based on impact
    const impactMultiplier = impact === "high" ? 0.3 : impact === "medium" ? 0.15 : 0.05;
    return Math.round(dailyPotentialLoss * 21 * impactMultiplier);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Website Analysis Results</h2>
        <p className="text-muted-foreground">
          Based on our AI-powered analysis of your website
        </p>
      </div>

      {/* AI Opportunities */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            <CardTitle>AI Opportunity Analysis</CardTitle>
          </div>
          <CardDescription>
            Specific areas where AI can be implemented on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-4">
            {opportunities.map((opp, index) => (
              <AccordionItem key={index} value={`opp-${index}`} className="border border-border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <h4 className="font-semibold text-left">{opp.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactColor(opp.impact)}>
                        {opp.impact} impact
                      </Badge>
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {formatCurrency(calculateEstimatedLoss(opp.impact))}/mo
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-2">
                  <p className="text-sm text-muted-foreground">{opp.description}</p>
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-sm">
                      <span className="font-medium">Implementation: </span>
                      {opp.implementation}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Customer Experience Gaps */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <CardTitle>Customer Experience Gaps</CardTitle>
          </div>
          <CardDescription>
            Friction points that AI can help resolve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-4">
            {experienceGaps.map((gap, index) => (
              <AccordionItem key={index} value={`gap-${index}`} className="border border-border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-500 text-left">
                      {gap.issue}
                    </h4>
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {formatCurrency(calculateEstimatedLoss("medium"))}/mo
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Impact: </span>
                      <span className="text-muted-foreground">{gap.impact}</span>
                    </p>
                    <p>
                      <span className="font-medium text-green-600 dark:text-green-500">
                        AI Solution: 
                      </span>
                      <span className="text-muted-foreground ml-1">{gap.solution}</span>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Content Analysis */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" />
            <CardTitle>Content Analysis</CardTitle>
          </div>
          <CardDescription>
            Insights on your service offerings and content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-4">
            {contentInsights.map((insight, index) => (
              <AccordionItem key={index} value={`insight-${index}`} className="border border-border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <h4 className="font-semibold text-left">{insight.area}</h4>
                    </div>
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {formatCurrency(calculateEstimatedLoss("low"))}/mo
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="text-sm space-y-1 pl-6">
                    <p className="text-muted-foreground">{insight.observation}</p>
                    <p>
                      <span className="font-medium text-primary">Recommendation: </span>
                      <span className="text-muted-foreground">{insight.recommendation}</span>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteInsights;
