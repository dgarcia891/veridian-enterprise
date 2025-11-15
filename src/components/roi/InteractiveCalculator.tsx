import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { useROICalculation, formatCurrency } from "@/hooks/useROICalculation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface InteractiveCalculatorProps {
  isMediumBusiness: boolean;
}

const costComparisonData = [
  { name: "Human Receptionist", cost: 55000, color: "hsl(var(--destructive))" },
  { name: "AI Agent", cost: 3000, color: "hsl(var(--primary))" },
];

const InteractiveCalculator = ({ isMediumBusiness }: InteractiveCalculatorProps) => {
  const navigate = useNavigate();
  
  // Create custom value mapping for customer value slider
  const customerValueMap = [
    ...Array.from({ length: 10 }, (_, i) => (i + 1) * 10), // 10, 20, 30...100
    ...Array.from({ length: 9 }, (_, i) => 100 + (i + 1) * 100) // 200, 300...1000
  ];
  
  // Default values based on business size
  // Small: 2 calls, $40 (index 3)
  // Medium: 1 call, $600 (index 14)
  const [missedCalls, setMissedCalls] = useState([isMediumBusiness ? 1 : 2]);
  const [customerValueIndex, setCustomerValueIndex] = useState([isMediumBusiness ? 14 : 3]);
  
  // Update values when business size changes
  useEffect(() => {
    if (isMediumBusiness) {
      setMissedCalls([1]);
      setCustomerValueIndex([14]); // $600
    } else {
      setMissedCalls([2]);
      setCustomerValueIndex([3]); // $40
    }
  }, [isMediumBusiness]);
  
  const customerValue = customerValueMap[customerValueIndex[0]];
  const { annualLoss } = useROICalculation(missedCalls[0], customerValue);

  return (
    <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16 bg-gradient-to-br from-background to-accent/20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 text-center">
          Your Personal <strong>ROI</strong>
        </h2>
        
        <p className="text-xl text-muted-foreground mb-3 text-center max-w-3xl mx-auto">
          Don't guess. <strong>See the real numbers.</strong>
        </p>
        
        <p className="text-xl text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          A human receptionist costs over <strong>$50,000/year</strong>. AI does more for less.
        </p>
        
        {/* Interactive Calculator */}
        <div className="glass-card p-8 rounded-lg mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
            <strong>Interactive Cost Calculator</strong>
          </h3>
          <p className="text-center text-muted-foreground mb-8">
            Drag the sliders to see your numbers.
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
                  max={10}
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
                    {formatCurrency(customerValue)}
                  </span>
                </div>
                <Slider
                  value={customerValueIndex}
                  onValueChange={setCustomerValueIndex}
                  min={0}
                  max={customerValueMap.length - 1}
                  step={1}
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
              <strong>Annual Cost: AI vs. Human</strong>
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
              <strong>Average 1st Year ROI</strong>
            </div>
            <div className="text-4xl sm:text-6xl font-extrabold text-primary mb-4">
              <strong>300%+</strong>
            </div>
            <p className="text-lg text-muted-foreground mb-3">
              AI adopters capture lost leads and cut costs.
            </p>
            <p className="text-lg text-muted-foreground">
              Some firms report up to <strong>1,775% ROI</strong>.
            </p>
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
            No complex setup required • Replaces $50k+ Human Receptionist
          </p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCalculator;
