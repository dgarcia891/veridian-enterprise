import { AlertCircle, PhoneMissed, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const kpiData = [{
  title: "Annual Loss for Small & Medium Businesses",
  value: "$126,000",
  description: "Average annual revenue lost from unanswered calls.",
  icon: TrendingDown
}, {
  title: "Customers Who Won't Call Back",
  value: "85%",
  description: "They don't leave a voicemail. They just hang up.",
  icon: PhoneMissed
}, {
  title: "Callers Who Go to a Competitor",
  value: "62%",
  description: "A missed call for you is a new customer for them.",
  icon: AlertCircle
}];
const missedCallsData = [{
  name: "Missed Calls",
  value: 62,
  color: "hsl(var(--destructive))"
}, {
  name: "Answered Calls",
  value: 38,
  color: "hsl(var(--muted))"
}];
const ProblemStatsSection = () => {
  const navigate = useNavigate();
  const [isMediumBusiness, setIsMediumBusiness] = useState(false);
  const annualLossValue = isMediumBusiness ? "$126,000" : "$17,000";
  const businessSize = isMediumBusiness ? "Medium" : "Small";
  return <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Problem */}
        <div className="mb-8 text-center max-w-4xl mx-auto">
          <p className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Dear Business Owner,
          </p>
          <p className="text-xl sm:text-2xl text-foreground mb-3">
            Are you losing customers because you can't answer the phone 24/7?
          </p>
          <p className="text-xl sm:text-2xl text-foreground">
            Have you watched your annual revenue shrink due to unanswered leads?
          </p>
        </div>

        {/* Agitate */}
        <div className="mb-12 text-center max-w-4xl mx-auto space-y-4">
          <p className="text-lg sm:text-xl text-muted-foreground">
            This isn't just a minor inconvenience.
          </p>
          
          <p className="text-xl sm:text-2xl font-bold text-destructive">
            This is the single biggest, silent revenue killer for your business.
          </p>
          
          <p className="text-xl sm:text-2xl font-bold text-destructive">
            It is costing you <span className="underline">$126,000 annually</span> in lost revenue.
          </p>
          
          <p className="text-lg sm:text-xl text-foreground">
            Worse, <span className="font-bold">85% of those customers won't call back.</span>
          </p>
          
          <p className="text-lg sm:text-xl text-foreground">
            They just hang up and immediately become a new customer for your competitor.
          </p>
        </div>

        {/* Solve */}
        <div className="mb-12 text-center max-w-4xl mx-auto space-y-4">
          <p className="text-xl sm:text-2xl font-bold text-primary">
            You don't need another expensive human receptionist.
          </p>
          
          <p className="text-xl sm:text-2xl font-bold text-primary">
            You need a growth engine that converts leads at a dramatically higher rate.
          </p>
          
          <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Our 24/7 AI agent guarantees a <span className="text-primary">100% call answer rate</span> and <span className="text-primary">300%+ ROI.</span>
          </p>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const isAnnualLossCard = index === 0;
          return <div key={index} className="glass-card p-6 rounded-lg border-t-4 border-destructive text-center">
                <Icon className="w-8 h-8 text-destructive mx-auto mb-3" />
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {kpi.title}
                </div>
                
                {isAnnualLossCard && <div className="flex items-center justify-center gap-3 mb-3">
                    <Label htmlFor="business-size" className={`text-sm text-foreground cursor-pointer transition-all ${!isMediumBusiness ? 'underline font-bold' : 'font-medium'}`}>
                      Small
                    </Label>
                    <Switch id="business-size" checked={isMediumBusiness} onCheckedChange={setIsMediumBusiness} />
                    <Label htmlFor="business-size" className={`text-sm text-foreground cursor-pointer transition-all ${isMediumBusiness ? 'underline font-bold' : 'font-medium'}`}>
                      Medium
                    </Label>
                  </div>}
                
                <div className="text-5xl font-extrabold text-destructive mb-2">
                  {isAnnualLossCard ? annualLossValue : kpi.value}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isAnnualLossCard ? `Average annual revenue lost from unanswered calls for ${businessSize.toLowerCase()} businesses.` : kpi.description}
                </p>
              </div>;
        })}
        </div>
        
        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Button 
            onClick={() => navigate("/signup")}
            size="lg"
            className="bg-primary text-primary-foreground rounded-full px-10 py-6 text-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 mx-auto group"
          >
            Get 100% Lead Capture Now
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Replaces $50,000 Human Receptionist WITHOUT High Salaries or Training Costs
          </p>
        </div>
      </div>
    </section>;
};
export default ProblemStatsSection;