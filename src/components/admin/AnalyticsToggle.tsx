import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EyeOff, Eye, Trash2, Loader2, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const AnalyticsToggle = () => {
  const [isIgnored, setIsIgnored] = useState(false);
  const [myIp, setMyIp] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedCount, setDeletedCount] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ignore_analytics") === "true";
    setIsIgnored(stored);

    // Fetch current IP
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setMyIp(data.ip))
      .catch((e) => console.error("Failed to fetch IP:", e));
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsIgnored(checked);
    localStorage.setItem("ignore_analytics", checked.toString());

    // Dispatch custom event for the dashboard to react immediately
    window.dispatchEvent(new Event("analytics-ignore-change"));

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

  const handleDeleteMyData = async () => {
    if (!myIp) {
      toast.error("Could not determine your IP address");
      return;
    }

    setIsDeleting(true);
    try {
      // First count how many records will be deleted
      const { count, error: countError } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", myIp);

      if (countError) throw countError;

      // Delete all events from this IP
      const { error } = await supabase
        .from("analytics_events")
        .delete()
        .eq("ip_address", myIp);

      if (error) throw error;

      setDeletedCount(count || 0);
      toast.success("Data Deleted", {
        description: `Removed ${count || 0} analytics events from your IP address.`,
        icon: <Trash2 className="h-4 w-4" />,
      });

      // Trigger refresh
      window.dispatchEvent(new Event("analytics-ignore-change"));
    } catch (error) {
      console.error("Failed to delete analytics data:", error);
      toast.error("Failed to delete data", {
        description: "Check console for details.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Admin Privacy
          {isIgnored && (
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium flex items-center gap-2">
              {isIgnored ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-primary" />
              )}
              Admin Privacy Mode
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Stop tracking your visits in analytics.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="analytics-ignore" className="text-sm">
              {isIgnored ? "Ignoring My Stats" : "Tracking My Stats"}
            </Label>
            <Switch
              id="analytics-ignore"
              checked={isIgnored}
              onCheckedChange={handleToggle}
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium flex items-center gap-2 text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete My Historical Data
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Permanently remove all analytics events from your current IP
              address.
            </p>
            {myIp && (
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Your IP: {myIp}
              </p>
            )}
            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-3"
              onClick={handleDeleteMyData}
              disabled={isDeleting || !myIp}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All My Events
                </>
              )}
            </Button>
            {deletedCount !== null && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Last deletion removed {deletedCount} events
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
