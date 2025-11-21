import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  CheckCircle2, 
  Clock, 
  Moon, 
  Calendar, 
  Globe, 
  MessageSquare,
  ArrowRight,
  Mail
} from "lucide-react";

interface RoofingUpsellSectionProps {
  onUpgradeClick: () => void;
  onEmailOnly: (email: string) => void;
}

const RoofingUpsellSection = ({ onUpgradeClick, onEmailOnly }: RoofingUpsellSectionProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const opportunities = [
    { icon: Clock, text: "Slow response times costing jobs", color: "text-orange-500" },
    { icon: Moon, text: "No after-hours communication", color: "text-blue-500" },
    { icon: Calendar, text: "Missing online scheduling", color: "text-purple-500" },
    { icon: Globe, text: "Poor website experience", color: "text-green-500" },
    { icon: MessageSquare, text: "No automated follow-ups", color: "text-pink-500" },
    { icon: CheckCircle2, text: "And 4+ other revenue gaps", color: "text-cyan-500" },
  ];

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }
    onEmailOnly(email.trim());
    setShowEmailDialog(false);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-8 md:p-12">
            {/* Headline */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Want to See What <span className="text-primary">ELSE</span> You're Missing?
              </h2>
              <p className="text-lg text-muted-foreground">
                That's just missed calls. Most roofing businesses are also losing revenue from:
              </p>
            </div>

            {/* Opportunity Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {opportunities.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-4 bg-background rounded-lg border"
                >
                  <item.icon className={`h-5 w-5 ${item.color} flex-shrink-0`} />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Value Props */}
            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-3 text-center">
                Your Complete AI Opportunity Report includes:
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Full revenue loss breakdown across 7+ categories</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Personalized AI Readiness Score and grade</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Specific AI solutions tailored to your business</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Complete ROI projections with recovery timeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Website analysis and improvement recommendations</span>
                </li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="space-y-4">
              <Button 
                size="lg" 
                onClick={onUpgradeClick}
                className="w-full text-lg h-14 font-semibold group"
              >
                Get My Complete AI Opportunity Report
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="text-center">
                <button
                  onClick={() => setShowEmailDialog(true)}
                  className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline inline-flex items-center gap-1"
                >
                  <Mail className="h-4 w-4" />
                  No Thanks, Just Email Me Call Analysis Results
                </button>
              </div>
            </div>

            {/* Trust Badge */}
            <p className="text-xs text-center text-muted-foreground mt-6">
              ✓ Still 100% free • Takes 2 more minutes • No credit card required
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Email Capture Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Your Call Analysis</DialogTitle>
            <DialogDescription>
              Enter your email to receive your call revenue analysis report.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
              {emailError && (
                <p className="text-sm text-destructive">{emailError}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowEmailDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleEmailSubmit} className="flex-1">
                Send Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoofingUpsellSection;
