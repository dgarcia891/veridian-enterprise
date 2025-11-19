import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, Calendar, Mail, RefreshCw, CheckCircle2 } from "lucide-react";

interface Solution {
  id: string;
  title: string;
  description: string;
  benefits: string[];
  icon: any;
  weProvide: boolean;
}

interface SolutionRecommendationsProps {
  solutions: string[];
  industry: string;
}

const SolutionRecommendations = ({ solutions, industry }: SolutionRecommendationsProps) => {
  const allSolutions: Record<string, Solution> = {
    "voice-receptionist": {
      id: "voice-receptionist",
      title: "AI Voice Receptionist",
      description: "24/7 automated call answering and lead qualification system",
      benefits: [
        "Never miss a call again",
        "Instant response to customers",
        "Qualified leads delivered to you",
        "Professional greeting every time"
      ],
      icon: Phone,
      weProvide: true
    },
    "chat-assistant": {
      id: "chat-assistant",
      title: "AI Chat Assistant",
      description: "Intelligent website chat support for instant customer engagement",
      benefits: [
        "24/7 instant responses",
        "Handle multiple chats simultaneously",
        "Capture leads automatically",
        "Reduce support workload"
      ],
      icon: MessageSquare,
      weProvide: true
    },
    "appointment-scheduling": {
      id: "appointment-scheduling",
      title: "Automated Appointment Scheduling",
      description: "Smart calendar management and booking system",
      benefits: [
        "Automatic booking and rescheduling",
        "SMS/Email reminders",
        "Reduce no-shows by 60%",
        "Free up staff time"
      ],
      icon: Calendar,
      weProvide: true
    },
    "follow-up-system": {
      id: "follow-up-system",
      title: "Follow-up & Nurture System",
      description: "Automated lead nurturing and re-engagement campaigns",
      benefits: [
        "Never let a lead go cold",
        "Personalized follow-up sequences",
        "Increase conversion rates",
        "Stay top of mind"
      ],
      icon: RefreshCw,
      weProvide: true
    },
    "email-assistant": {
      id: "email-assistant",
      title: "AI Email Assistant",
      description: "Intelligent email management and response system",
      benefits: [
        "Faster response times",
        "Automated email triage",
        "Draft intelligent responses",
        "Better organization"
      ],
      icon: Mail,
      weProvide: false
    }
  };

  const recommendedSolutions = solutions.map(id => allSolutions[id]).filter(Boolean);
  const weProvide = recommendedSolutions.filter(s => s.weProvide);
  const weRecommend = recommendedSolutions.filter(s => !s.weProvide);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-2xl">Recommended AI Solutions</CardTitle>
        <p className="text-muted-foreground">
          Based on your industry and business needs
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {weProvide.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Solutions We Provide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weProvide.map((solution) => {
                const Icon = solution.icon;
                return (
                  <div
                    key={solution.id}
                    className="p-5 rounded-lg bg-card/50 border border-primary/20 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{solution.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {solution.description}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {solution.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {weRecommend.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Badge variant="outline">Partner Solutions</Badge>
              Additional Recommendations
            </h3>
            <p className="text-sm text-muted-foreground">
              We can help connect you with trusted partners for these solutions
            </p>
            <div className="grid grid-cols-1 gap-4">
              {weRecommend.map((solution) => {
                const Icon = solution.icon;
                return (
                  <div
                    key={solution.id}
                    className="p-4 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{solution.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {solution.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SolutionRecommendations;
