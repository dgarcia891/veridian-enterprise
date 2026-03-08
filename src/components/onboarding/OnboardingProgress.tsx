import { Check } from "lucide-react";

interface OnboardingProgressProps {
  currentStep: number;
  steps: string[];
}

const OnboardingProgress = ({ currentStep, steps }: OnboardingProgressProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNum}
              </div>
              <span className={`text-xs mt-1.5 max-w-[80px] text-center ${isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-1 mt-[-16px] ${isCompleted ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OnboardingProgress;
