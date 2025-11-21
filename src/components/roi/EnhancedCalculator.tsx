import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { useROICalculation, formatCurrency } from "@/hooks/useROICalculation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { DollarSign, ArrowRight, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const costComparisonData = [
  { name: "Human Receptionist", cost: 55000, color: "hsl(var(--destructive))" },
  { name: "AI Agent", cost: 3000, color: "hsl(var(--primary))" },
];

const EnhancedCalculator = () => {
  const navigate = useNavigate();
  const [isMediumBusiness, setIsMediumBusiness] = useState(false);
  
  // Create custom value mapping for customer profit slider
  const customerValueMap = [
    ...Array.from({ length: 10 }, (_, i) => (i + 1) * 10), // 10, 20, 30...100
    ...Array.from({ length: 9 }, (_, i) => 100 + (i + 1) * 100) // 200, 300...1000
  ];
  
  const [missedCalls, setMissedCalls] = useState([isMediumBusiness ? 1 : 10]);
  const [customerValueIndex, setCustomerValueIndex] = useState([isMediumBusiness ? 16 : 3]);
  
  // Update values when business size changes
  useEffect(() => {
    if (isMediumBusiness) {
      setMissedCalls([1]);
      setCustomerValueIndex([16]); // $800
    } else {
      setMissedCalls([10]);
      setCustomerValueIndex([3]); // $40
    }
  }, [isMediumBusiness]);
  
  const customerValue = customerValueMap[customerValueIndex[0]];
  const { dailyLoss, monthlyLoss, annualLoss } = useROICalculation(missedCalls[0], customerValue);
  
  const aiSavings = 55000 - 3000; // Human cost - AI cost
  const totalFirstYearBenefit = annualLoss + aiSavings;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-accent/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            ROI Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate exactly how much revenue you're losing from missed calls and see your potential ROI with AI.
          </p>
          
          {/* Business Size Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <Label htmlFor="business-size" className={`text-sm cursor-pointer transition-all ${!isMediumBusiness ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
              Small Business
            </Label>
            <Switch 
              id="business-size" 
              checked={isMediumBusiness} 
              onCheckedChange={setIsMediumBusiness} 
            />
            <Label htmlFor="business-size" className={`text-sm cursor-pointer transition-all ${isMediumBusiness ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
              Medium Business
            </Label>
          </div>
        </div>
        
        {/* Main Calculator Card */}
        <Card className="p-8 mb-8 bg-card/50 backdrop-blur">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Input Your Numbers
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Input Sliders */}
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-base font-semibold text-foreground">
                    Missed Calls Per Week
                  </label>
                  <span className="text-3xl font-bold text-primary">
                    {missedCalls[0]}
                  </span>
                </div>
                <Slider
                  value={missedCalls}
                  onValueChange={setMissedCalls}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  How many potential customers call but don't reach you?
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-base font-semibold text-foreground">
                    Average Profit Per Customer
                  </label>
                  <span className="text-3xl font-bold text-primary">
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
                <p className="text-sm text-muted-foreground mt-2">
                  What's your typical profit from a new customer?
                </p>
              </div>
            </div>
            
            {/* Revenue Loss Display */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-destructive/10 to-destructive/20 rounded-xl p-6 border-2 border-destructive/40">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-6 h-6 text-destructive" />
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Annual Revenue Lost
                  </span>
                </div>
                <div className="text-5xl font-extrabold text-destructive mb-2">
                  {formatCurrency(annualLoss)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on 85% of missed callers never calling back
                </p>
              </div>
              
              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground uppercase">Daily Loss</span>
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {formatCurrency(dailyLoss)}
                  </div>
                </div>
                
                <div className="bg-card rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground uppercase">Monthly Loss</span>
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {formatCurrency(monthlyLoss)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cost Comparison Chart */}
          <Card className="p-8 bg-card/50 backdrop-blur">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              Annual Cost Comparison
            </h3>
            <div className="w-full" style={{ height: "280px" }}>
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
            <p className="text-sm text-muted-foreground text-center mt-4">
              Save <strong>{formatCurrency(aiSavings)}</strong> annually on staffing costs
            </p>
          </Card>
          
          {/* Total Impact Card */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/20 border-2 border-primary/40 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Total First Year Impact
              </span>
            </div>
            <div className="text-5xl font-extrabold text-primary mb-4">
              {formatCurrency(totalFirstYearBenefit)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue recovered:</span>
                <span className="font-semibold text-foreground">{formatCurrency(annualLoss)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Staffing savings:</span>
                <span className="font-semibold text-foreground">{formatCurrency(aiSavings)}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-foreground font-semibold">AI Investment:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(3000)}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Average ROI: <strong className="text-primary">300%+</strong> in the first year
            </p>
          </Card>
        </div>
        
        {/* Methodology Note */}
        <Card className="p-6 bg-muted/30 mb-8">
          <h4 className="text-sm font-semibold text-foreground mb-2">How We Calculate This</h4>
          <p className="text-sm text-muted-foreground">
            Our calculations are based on industry research showing that <strong>85% of callers won't call back</strong> after a missed call, 
            and <strong>62% will call a competitor</strong> instead. We assume 250 working days per year (5 days/week × 50 weeks) 
            to calculate your annual revenue loss. Human receptionist costs include average salary, benefits, and training expenses.
          </p>
        </Card>
        
        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={() => navigate("/signup")}
            size="lg"
            className="bg-primary text-primary-foreground rounded-full px-12 py-6 text-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 mx-auto group shadow-lg"
          >
            Start Capturing 100% of Your Calls
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No setup fees • 24/7 coverage • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default EnhancedCalculator;
