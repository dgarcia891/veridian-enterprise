import { AlertCircle, PhoneMissed, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const kpiData = [
  {
    title: "Annual Loss for Small & Medium Businesses",
    value: "$126,000",
    description: "Average annual revenue lost from unanswered calls.",
    icon: TrendingDown,
  },
  {
    title: "Customers Who Won't Call Back",
    value: "85%",
    description: "They don't leave a voicemail. They just hang up.",
    icon: PhoneMissed,
  },
  {
    title: "Callers Who Go to a Competitor",
    value: "62%",
    description: "A missed call for you is a new customer for them.",
    icon: AlertCircle,
  },
];

const missedCallsData = [
  { name: "Missed Calls", value: 62, color: "hsl(var(--destructive))" },
  { name: "Answered Calls", value: 38, color: "hsl(var(--muted))" },
];

const ProblemStatsSection = () => {
  return (
    <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4 text-center">
          Stop Missing Calls. Start Growing.
        </h2>
        <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          As a business owner, you're busy. But data shows that missed calls aren't just a minor inconvenience—they are the single biggest, silent revenue killer for your business.
        </p>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 rounded-lg border-t-4 border-destructive text-center"
              >
                <Icon className="w-8 h-8 text-destructive mx-auto mb-3" />
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {kpi.title}
                </div>
                <div className="text-5xl font-extrabold text-destructive mb-2">
                  {kpi.value}
                </div>
                <p className="text-sm text-muted-foreground">
                  {kpi.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatsSection;
