import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ReadinessScoreProps {
  score: number;
  tier: string;
}

const ReadinessScore = ({ score, tier }: ReadinessScoreProps) => {
  const getTierConfig = (tier: string) => {
    switch (tier) {
      case "AI Critical":
        return {
          color: "bg-green-500",
          badge: "default",
          description: "High urgency - AI implementation can have major impact on your business immediately."
        };
      case "Ready for AI":
        return {
          color: "bg-blue-500",
          badge: "secondary",
          description: "Good fit with clear ROI - AI voice agents will significantly improve your operations."
        };
      default:
        return {
          color: "bg-yellow-500",
          badge: "outline",
          description: "Basic opportunities exist - AI can help streamline specific areas of your business."
        };
    }
  };

  const config = getTierConfig(tier);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-2xl">Your AI Readiness Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${score * 5.53} ${553 - score * 5.53}`}
                className={config.color}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold">{score}</div>
                <div className="text-sm text-muted-foreground">out of 100</div>
              </div>
            </div>
          </div>

          <Badge variant={config.badge as any} className="text-lg px-4 py-2">
            {tier}
          </Badge>
        </div>

        <p className="text-center text-muted-foreground">
          {config.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ReadinessScore;
