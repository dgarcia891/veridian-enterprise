import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Calendar, Users } from "lucide-react";

const conversionData = [
  { stage: "Before AI", rate: 12 },
  { stage: "After AI", rate: 38.4 },
];

const growthStats = [
  {
    title: "Lead Response Time",
    value: "7x",
    description: "Leads are 7x more likely to convert if responded to in the first hour. An AI responds in 1 second.",
    icon: TrendingUp,
  },
  {
    title: "Appointments Booked",
    value: "+220%",
    description: "A case study showed a 220% increase in lead-to-appointment conversions with an AI agent.",
    icon: Calendar,
  },
  {
    title: "Customer Satisfaction",
    value: "+20%",
    description: "61% of consumers prefer a faster AI response over waiting for a human agent.",
    icon: Users,
  },
];

const GrowthSection = () => {
  return (
    <section id="growth" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 text-center">
          From Saving Money to Making Money
        </h2>
        <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          An AI agent isn't just a cost-saver, it's a growth engine. By responding instantly, it converts leads at a dramatically higher rate.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversion Chart */}
          <div className="glass-card p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
              Lead Conversion: Before vs. After AI
            </h3>
            <p className="text-center text-muted-foreground mb-6">
              Instant follow-up is proven to increase conversions.
            </p>
            <div className="w-full" style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="stage" 
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 50]}
                  />
                  <Tooltip 
                    formatter={(value: number) => `${value}%`}
                    labelFormatter={(label) => `Stage: ${label}`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Growth Stats */}
          <div className="space-y-6">
            {growthStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-6 rounded-lg border-t-4 border-green-500 text-center"
                >
                  <Icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    {stat.title}
                  </div>
                  <div className="text-5xl font-extrabold text-green-600 mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthSection;
