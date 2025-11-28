import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NextStepsSectionProps {
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
  };
}

const NextStepsSection = ({ contactInfo }: NextStepsSectionProps) => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/schedule-consultation");
  };

  const handleSchedule = () => {
    navigate("/schedule-consultation");
  };

  return (
    <Card className="glass-card border-primary/30">
      <CardHeader>
        <CardTitle className="text-2xl">Ready to Transform Your Business?</CardTitle>
        <p className="text-muted-foreground">
          Choose how you'd like to proceed, {contactInfo.firstName}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-lg bg-primary/10 border border-primary/20 space-y-3">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Calendar className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Book a Strategy Call</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Meet with an AI specialist for 30 minutes to discuss:
            </p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Custom implementation plan for your business</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Detailed ROI analysis specific to your needs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Answers to all your questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Next steps for implementation</span>
              </li>
            </ul>
            <Button 
              onClick={handleSchedule}
              className="w-full mt-4" 
              size="lg"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Free Call
            </Button>
          </div>

          <div className="p-6 rounded-lg bg-secondary/10 border border-secondary/20 space-y-3">
            <div className="flex items-center gap-2 text-secondary mb-2">
              <Zap className="h-6 w-6" />
              <h3 className="text-xl font-semibold">Get Started Now</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Ready to implement right away? Choose your plan:
            </p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">•</span>
                <span>Simple setup process</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">•</span>
                <span>Live within 48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">•</span>
                <span>Full training and support included</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">•</span>
                <span>30-day money-back guarantee</span>
              </li>
            </ul>
            <Button 
              onClick={handleSignup}
              variant="secondary"
              className="w-full mt-4" 
              size="lg"
            >
              <Zap className="mr-2 h-5 w-5" />
              Choose Your Plan
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-4">
          Questions? Call us at <a href="tel:661-523-0269" className="text-primary hover:underline">661-523-0269</a> or email <a href="mailto:support@aiagents3000.com" className="text-primary hover:underline">support@aiagents3000.com</a>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextStepsSection;
