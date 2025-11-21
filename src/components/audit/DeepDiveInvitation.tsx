import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, TrendingUp } from "lucide-react";

interface DeepDiveInvitationProps {
  onAccept: () => void;
  onDecline: () => void;
  industry?: string;
}

const DeepDiveInvitation = ({ onAccept, onDecline, industry }: DeepDiveInvitationProps) => {
  return (
    <div className="max-w-2xl mx-auto min-h-[60vh] flex items-center">
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/10 shadow-xl">
        <CardContent className="p-8 md:p-12 text-center space-y-8">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-2">
            <TrendingUp className="h-10 w-10 text-primary" />
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">
              Great! Your Report is Generating...
            </h2>
            <p className="text-xl text-muted-foreground">
              Want to unlock even <span className="text-foreground font-semibold">MORE</span> detailed insights?
            </p>
          </div>

          {/* Value Proposition */}
          <Card className="bg-card/50 border-primary/20">
            <CardContent className="p-6">
              <p className="font-semibold mb-4">
                Answer 5 more questions (3 minutes) to see:
              </p>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Exact revenue loss across 7+ categories</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Website-specific AI recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Precise ROI calculations & recovery timeline</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    How you compare to {industry || "industry"} benchmarks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Priority roadmap: What to implement first</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTAs */}
          <div className="space-y-4 pt-4">
            <Button
              size="lg"
              onClick={onAccept}
              className="w-full md:w-auto md:min-w-[280px] text-lg h-14 font-semibold hover:scale-[1.02] transition-all"
            >
              Yes, Show Me Everything →
            </Button>

            <div>
              <Button
                variant="ghost"
                onClick={onDecline}
                className="text-muted-foreground hover:text-foreground"
              >
                No Thanks, Generate Report
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              All questions optional - skip any you don't know
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeepDiveInvitation;
