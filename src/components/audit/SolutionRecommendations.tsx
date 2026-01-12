import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, MessageSquare, Calendar, Mail, RefreshCw, CheckCircle2, DollarSign } from "lucide-react";
import { formatCurrency } from "@/hooks/useROICalculation";

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
  missedCallsPerWeek: number;
  avgProfitPerCustomer: number;
}

const SolutionRecommendations = ({ solutions, industry, missedCallsPerWeek, avgProfitPerCustomer }: SolutionRecommendationsProps) => {
  const calculateSolutionLoss = (solutionId: string) => {
    const callbackRate = 0.15;
    const workingDaysPerWeek = 5;
    const missedCallsPerDay = missedCallsPerWeek / workingDaysPerWeek;
    const dailyPotentialLoss = missedCallsPerDay * avgProfitPerCustomer * (1 - callbackRate);
    
    // Different solutions prevent different percentages of loss
    const preventionRates: Record<string, number> = {
      "voice-receptionist": 0.85, // Prevents 85% of missed call loss
      "chat-assistant": 0.60,     // Prevents 60% of lost web leads
      "appointment-scheduling": 0.40, // Prevents 40% of scheduling-related loss
      "follow-up-system": 0.50,   // Prevents 50% of cold lead loss
      "email-assistant": 0.30     // Prevents 30% of email-related loss
    };
    
    const preventionRate = preventionRates[solutionId] || 0.5;
    return Math.round(dailyPotentialLoss * 21 * preventionRate);
  };

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
            <Accordion type="multiple" className="space-y-4">
              {weProvide.map((solution) => {
                const Icon = solution.icon;
                return (
                  <AccordionItem key={solution.id} value={solution.id} className="border border-primary/20 rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <h4 className="font-semibold text-left">{solution.title}</h4>
                        </div>
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {formatCurrency(calculateSolutionLoss(solution.id))}/mo lost
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground mb-3">{solution.description}</p>
                      <ul className="space-y-1">
                        {solution.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
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
            <Accordion type="multiple" className="space-y-4">
              {weRecommend.map((solution) => {
                const Icon = solution.icon;
                return (
                  <AccordionItem key={solution.id} value={solution.id} className="border border-border rounded-lg">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <Icon className="h-5 w-5" />
                          </div>
                          <h4 className="font-semibold text-left">{solution.title}</h4>
                        </div>
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {formatCurrency(calculateSolutionLoss(solution.id))}/mo lost
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground">{solution.description}</p>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SolutionRecommendations;
