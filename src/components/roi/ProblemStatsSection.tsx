import { AlertCircle, PhoneMissed, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const kpiData = [
  {
    title: "Annual Loss for SMBs",
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
  { name: "Missed Calls", value: 62, color: "hsl(25 95% 53%)" }, // Warm orange for urgency
  { name: "Answered Calls", value: 38, color: "hsl(142 76% 36%)" }, // Green for success
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
                className="glass-card p-6 rounded-lg border-t-4 border-orange-500 text-center"
              >
                <Icon className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {kpi.title}
                </div>
                <div className="text-5xl font-extrabold text-orange-600 mb-2">
                  {kpi.value}
                </div>
                <p className="text-sm text-muted-foreground">
                  {kpi.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Donut Chart */}
        <div className="glass-card p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
            The Scale of the Problem
          </h3>
          <p className="text-center text-muted-foreground mb-6">
            Studies show that many SMBs miss the majority of their inbound calls.
          </p>
          <div className="w-full max-w-md mx-auto" style={{ height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={missedCallsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {missedCallsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatsSection;
