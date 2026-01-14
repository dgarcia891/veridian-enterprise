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

interface Opportunity {
  icon: any;
  text: string;
  color: string;
  title: string;
  description: string;
  solutions: string[];
}

interface RoofingUpsellSectionProps {
  onUpgradeClick: () => void;
  onEmailOnly: (email: string) => void;
}

const RoofingUpsellSection = ({ onUpgradeClick, onEmailOnly }: RoofingUpsellSectionProps) => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState<number | null>(null);

  const opportunities: Opportunity[] = [
    {
      icon: Clock,
      text: "Slow response times costing jobs",
      color: "text-orange-500",
      title: "Instant Response AI",
      description: "Customers call 3-5 roofers. First to respond wins the job.",
      solutions: [
        "AI answers every call in under 10 seconds",
        "Responds to texts instantly, 24/7",
        "Books estimates while competitors sleep"
      ]
    },
    {
      icon: Moon,
      text: "No after-hours communication",
      color: "text-blue-500",
      title: "24/7 AI Receptionist",
      description: "Storm damage happens at midnight. Emergency calls go to voicemail.",
      solutions: [
        "Handle emergency calls any time",
        "Prioritize urgent jobs automatically",
        "Wake up to scheduled appointments"
      ]
    },
    {
      icon: Calendar,
      text: "Missing online scheduling",
      color: "text-purple-500",
      title: "Self-Service Booking",
      description: "Modern customers expect instant booking, not phone tag.",
      solutions: [
        "Let customers book online 24/7",
        "Automatic calendar integration",
        "Reduce no-shows by 60%"
      ]
    },
    {
      icon: Globe,
      text: "Poor website experience",
      color: "text-green-500",
      title: "AI Chat Assistant",
      description: "Visitors leave if they can't get instant answers.",
      solutions: [
        "Answer questions in real-time",
        "Pre-qualify leads automatically",
        "Book estimates from website chat"
      ]
    },
    {
      icon: MessageSquare,
      text: "No automated follow-ups",
      color: "text-pink-500",
      title: "Smart Follow-Up System",
      description: "You give a quote, then silence. Competitors who follow up win.",
      solutions: [
        "Auto-send personalized follow-ups",
        "Check-in at perfect intervals",
        "Recover 'dead' leads automatically"
      ]
    },
    {
      icon: CheckCircle2,
      text: "And 4+ other revenue gaps",
      color: "text-cyan-500",
      title: "Complete Business Analysis",
      description: "Most businesses have hidden inefficiencies they don't even see.",
      solutions: [
        "Identify YOUR specific gaps",
        "Custom AI roadmap & ROI projections",
        "Prioritized by biggest impact"
      ]
    },
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
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-8 md:p-12">
            {/* Headline */}
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-2">
                Prefer a detailed analysis first?
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Or Get Your Complete <span className="text-primary">AI Opportunity Report</span>
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
                  onClick={() => setSelectedOpportunity(index)}
                  className="flex items-center gap-3 p-4 bg-background rounded-lg border 
                    cursor-pointer transition-all duration-200 
                    hover:scale-105 hover:shadow-lg hover:bg-accent hover:border-primary/50
                    active:scale-100 group"
                >
                  <item.icon className={`h-5 w-5 ${item.color} flex-shrink-0 transition-transform group-hover:scale-110`} />
                  <span className="text-sm font-medium flex-1">{item.text}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
                className="w-full text-lg h-14 font-semibold group hover:scale-[1.02] hover:shadow-xl transition-all"
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

      {/* Opportunity Details Dialog */}
      <Dialog open={selectedOpportunity !== null} onOpenChange={() => setSelectedOpportunity(null)}>
        <DialogContent className="max-w-md">
          {selectedOpportunity !== null && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-3 rounded-full bg-accent`}>
                    {(() => {
                      const Icon = opportunities[selectedOpportunity].icon;
                      return <Icon className={`h-6 w-6 ${opportunities[selectedOpportunity].color}`} />;
                    })()}
                  </div>
                  <DialogTitle className="text-xl">
                    {opportunities[selectedOpportunity].title}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-base">
                  {opportunities[selectedOpportunity].description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground">How AI Solves This:</h4>
                <ul className="space-y-2">
                  {opportunities[selectedOpportunity].solutions.map((solution, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => {
                  setSelectedOpportunity(null);
                  onUpgradeClick();
                }}
                className="w-full"
              >
                See Full Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoofingUpsellSection;
