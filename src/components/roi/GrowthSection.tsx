import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Calendar, Users, ArrowRight, DollarSign, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const conversionData = [
  { stage: "Before AI", rate: 12 },
  { stage: "After AI", rate: 38.4 },
];

const growthStats = [
  {
    icon: Clock,
    metric: "7x",
    statLabel: "Higher Conversion Rate",
    headline: "Turn Speed Into Revenue",
    benefit: "Leads convert 7x more when answered in the first hour.",
    moneyImpact: "AI responds in 1 second. Every second counts.",
  },
  {
    icon: Calendar,
    metric: "+220%",
    statLabel: "More Appointments Booked",
    headline: "Triple Your Appointment Rate",
    benefit: "Case study: 220% increase in lead-to-appointment conversions.",
    moneyImpact: "More appointments = More closed deals = More revenue.",
  },
  {
    icon: Users,
    metric: "61%",
    statLabel: "Customer Preference",
    headline: "Give Customers What They Want",
    benefit: "61% prefer faster AI response over waiting for humans.",
    moneyImpact: "Happy customers buy more. Satisfied customers refer more.",
  },
];

const GrowthSection = () => {
  const navigate = useNavigate();
  
  return (
    <section id="growth" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6 text-center">
          From <strong>Saving Money</strong> to <strong>Making Money</strong>
        </h2>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-3 text-center max-w-3xl mx-auto">
          An AI agent isn't just a cost-saver.
        </p>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          It's a <strong>growth engine</strong> that converts leads at higher rates.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversion Chart */}
          <div className="glass-card p-4 sm:p-6 md:p-8 rounded-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 text-center">
              <strong>Lead Conversion: Before vs. After AI</strong>
            </h3>
            <p className="text-sm sm:text-base text-center text-muted-foreground mb-6">
              Instant follow-up increases conversions.
            </p>
            <div className="w-full" style={{ height: "250px" }}>
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
          
          {/* Conversion Proof Cards */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-8">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                <strong>Conversion Proof: How AI Makes You Money</strong>
              </h3>
            </div>
            
            {growthStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-4 sm:p-6 rounded-lg border-l-4 border-primary hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary">
                          <strong>{stat.metric}</strong>
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          {stat.statLabel}
                        </span>
                      </div>
                      
                      <h4 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                        {stat.headline}
                      </h4>
                      
                      <p className="text-sm sm:text-base text-muted-foreground mb-2">
                        {stat.benefit}
                      </p>
                      
                      <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border">
                        <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold text-foreground">
                          <strong>{stat.moneyImpact}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate("/schedule-consultation")}
            size="lg"
            className="bg-primary text-primary-foreground rounded-full px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 mx-auto group w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Get 100% Lead Capture Now</span>
            <span className="sm:hidden">Get Started</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0" aria-hidden="true" />
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
