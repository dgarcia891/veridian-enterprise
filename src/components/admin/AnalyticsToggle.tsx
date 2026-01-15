import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";

export const AnalyticsToggle = () => {
  const [isIgnored, setIsIgnored] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ignore_analytics") === "true";
    setIsIgnored(stored);
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsIgnored(checked);
    localStorage.setItem("ignore_analytics", checked.toString());

    // Dispatch custom event for the dashboard to react immediately
    window.dispatchEvent(new Event('analytics-ignore-change'));

    if (checked) {
      toast.success("Analytics Ignored", {
        description: "Your activity will no longer be tracked in metrics.",
        icon: <EyeOff className="h-4 w-4" />,
      });
    } else {
      toast.success("Analytics Active", {
        description: "Your activity is now being tracked.",
        icon: <Eye className="h-4 w-4" />,
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {isIgnored ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-primary" />}
          Admin Privacy Mode
        </CardTitle>
        <CardDescription>
          Toggle this on to prevent your own visits from skewing the website analytics data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Switch
          id="analytics-ignore"
          checked={isIgnored}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="analytics-ignore" className="text-sm font-medium">
          {isIgnored ? "Ignoring My Stats (Active)" : "Tracking My Stats"}
        </Label>
      </CardContent>
    </Card>
  );
};
