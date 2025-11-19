import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, Brain, TrendingUp, Target, Zap } from "lucide-react";

const ProcessingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Brain, text: "Analyzing your business metrics..." },
    { icon: TrendingUp, text: "Calculating revenue impact..." },
    { icon: Target, text: "Determining AI readiness score..." },
    { icon: Zap, text: "Generating personalized recommendations..." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 750);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <Card className="glass-card p-12 max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-primary/20 animate-ping"></div>
          </div>
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Processing Your Data</h2>
          <div className="space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 scale-105"
                      : isPast
                      ? "opacity-50"
                      : "opacity-30"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isActive ? "font-semibold" : "font-normal"
                    }`}
                  >
                    {step.text}
                  </span>
                  {isPast && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProcessingScreen;
