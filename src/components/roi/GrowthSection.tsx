import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const conversionData = [
  { stage: "Before AI", rate: 12 },
  { stage: "After AI", rate: 38.4 },
];

const growthStats = [
  {
    title: "Lead Response Time",
    value: "7x",
    description: "Leads are 7x more likely to convert in the first hour. AI responds in 1 second.",
    icon: TrendingUp,
  },
  {
    title: "Appointments Booked",
    value: "+220%",
    description: "Case study: 220% increase in conversions with an AI agent.",
    icon: Calendar,
  },
  {
    title: "Customer Satisfaction",
    value: "+20%",
    description: "61% of consumers prefer faster AI response over waiting.",
    icon: Users,
  },
];

const GrowthSection = () => {
  const navigate = useNavigate();
  
  return (
    <section id="growth" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 text-center">
          From <strong>Saving Money</strong> to <strong>Making Money</strong>
        </h2>
        
        <p className="text-xl text-muted-foreground mb-3 text-center max-w-3xl mx-auto">
          An AI agent isn't just a cost-saver.
        </p>
        
        <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          It's a <strong>growth engine</strong> that converts leads at higher rates.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversion Chart */}
          <div className="glass-card p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
              <strong>Lead Conversion: Before vs. After AI</strong>
            </h3>
            <p className="text-center text-muted-foreground mb-6">
              Instant follow-up increases conversions.
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
                  className="glass-card p-6 rounded-lg border-t-4 border-primary text-center"
                >
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    <strong>{stat.title}</strong>
                  </div>
                  <div className="text-5xl font-extrabold text-primary mb-2">
                    <strong>{stat.value}</strong>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
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
            60-Day Money Back Guarantee • No Training Costs or Hidden Fees
          </p>
        </div>
      </div>
    </section>
  );
};

export default GrowthSection;
