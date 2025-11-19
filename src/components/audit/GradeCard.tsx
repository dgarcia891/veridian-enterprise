import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GradeCardProps {
  title: string;
  grade: string;
  description: string;
  className?: string;
}

const GradeCard = ({ title, grade, description, className }: GradeCardProps) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-500 border-green-500/50 bg-green-500/10';
      case 'B':
        return 'text-blue-500 border-blue-500/50 bg-blue-500/10';
      case 'C':
        return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
      case 'D':
        return 'text-orange-500 border-orange-500/50 bg-orange-500/10';
      case 'F':
        return 'text-red-500 border-red-500/50 bg-red-500/10';
      default:
        return 'text-muted-foreground border-muted bg-muted/10';
    }
  };

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className={cn(
          "inline-flex items-center justify-center rounded-lg border-2 w-16 h-16 text-4xl font-bold",
          getGradeColor(grade)
        )}>
          {grade}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default GradeCard;
