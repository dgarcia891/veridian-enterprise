import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, AlertTriangle, FileText, CheckCircle } from "lucide-react";

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
}

const WebsiteInsights = ({ opportunities, experienceGaps, contentInsights }: WebsiteInsightsProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted";
    }
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
        <CardContent className="space-y-4">
          {opportunities.map((opp, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold">{opp.title}</h4>
                <Badge className={getImpactColor(opp.impact)}>
                  {opp.impact} impact
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{opp.description}</p>
              <div className="pt-2 border-t border-border/50">
                <p className="text-sm">
                  <span className="font-medium">Implementation: </span>
                  {opp.implementation}
                </p>
              </div>
            </div>
          ))}
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
        <CardContent className="space-y-4">
          {experienceGaps.map((gap, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-2">
              <h4 className="font-semibold text-yellow-600 dark:text-yellow-500">
                {gap.issue}
              </h4>
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
            </div>
          ))}
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
        <CardContent className="space-y-4">
          {contentInsights.map((insight, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                {insight.area}
              </h4>
              <div className="text-sm space-y-1 pl-6">
                <p className="text-muted-foreground">{insight.observation}</p>
                <p>
                  <span className="font-medium text-primary">Recommendation: </span>
                  <span className="text-muted-foreground">{insight.recommendation}</span>
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteInsights;
