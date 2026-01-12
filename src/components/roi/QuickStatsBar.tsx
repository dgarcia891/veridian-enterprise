import { PhoneMissed, TrendingDown, Users } from "lucide-react";

const QuickStatsBar = () => {
  const stats = [
    { 
      icon: PhoneMissed, 
      value: "85%", 
      label: "Won't call back" 
    },
    { 
      icon: Users, 
      value: "62%", 
      label: "Go to competitors" 
    },
    { 
      icon: TrendingDown, 
      value: "$126k", 
      label: "Avg. annual loss" 
    },
  ];

  return (
    <div className="bg-card/50 border-y border-border py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center justify-center gap-3">
                <Icon className="w-5 h-5 text-destructive flex-shrink-0" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickStatsBar;
