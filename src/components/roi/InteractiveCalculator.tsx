import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { useROICalculation, formatCurrency } from "@/hooks/useROICalculation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DollarSign } from "lucide-react";

const costComparisonData = [
  { name: "Human Receptionist", cost: 55000, color: "hsl(var(--destructive))" },
  { name: "AI Agent", cost: 3000, color: "hsl(var(--primary))" },
];

const InteractiveCalculator = () => {
  const [missedCalls, setMissedCalls] = useState([10]);
  const [customerValue, setCustomerValue] = useState([60]);
  
  const { annualLoss } = useROICalculation(missedCalls[0], customerValue[0]);

  return (
    <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16 bg-gradient-to-br from-background to-accent/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 text-center">
          Your Personal ROI
        </h2>
        <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          Don't guess. See the real numbers. A full-time human receptionist costs over $50,000/year. An AI agent does more, for less.
        </p>
        
        {/* Interactive Calculator */}
        <div className="glass-card p-8 rounded-lg mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
            Interactive Cost Calculator
          </h3>
          <p className="text-center text-muted-foreground mb-8">
            Drag the sliders to match your business.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Sliders */}
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-foreground">
                    Missed Calls Per Day:
                  </label>
                  <span className="text-2xl font-bold text-primary">
                    {missedCalls[0]}
                  </span>
                </div>
                <Slider
                  value={missedCalls}
                  onValueChange={setMissedCalls}
                  min={1}
                  max={25}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-foreground">
                    Average Value Per Customer:
                  </label>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(customerValue[0])}
                  </span>
                </div>
                <Slider
                  value={customerValue}
                  onValueChange={setCustomerValue}
                  min={50}
                  max={800}
                  step={50}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Result Display */}
            <div className="bg-gradient-to-br from-destructive/10 to-destructive/20 rounded-lg p-8 text-center border-2 border-destructive/40">
              <DollarSign className="w-12 h-12 text-destructive mx-auto mb-3" />
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Potential Annual Revenue Lost
              </div>
              <div className="text-4xl sm:text-6xl font-extrabold text-destructive mb-3">
                {formatCurrency(annualLoss)}
              </div>
              <p className="text-sm text-muted-foreground">
                (Based on 85% of missed callers never calling back)
              </p>
            </div>
          </div>
        </div>
        
        {/* Cost Comparison & ROI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cost Comparison Chart */}
          <div className="glass-card p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Annual Cost: AI vs. Human
            </h3>
            <div className="w-full" style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costComparisonData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
                    {costComparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* ROI Card */}
          <div className="glass-card p-8 rounded-lg flex flex-col justify-center text-center border-t-4 border-primary">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Average 1st Year ROI
            </div>
            <div className="text-4xl sm:text-6xl font-extrabold text-primary mb-4">
              300%+
            </div>
            <p className="text-lg text-muted-foreground">
              Case studies show AI agent adopters achieve massive ROI by capturing lost leads and cutting costs. Some firms report up to 1,775% ROI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCalculator;
