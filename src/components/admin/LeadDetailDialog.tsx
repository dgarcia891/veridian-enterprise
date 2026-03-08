import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail, Phone, Building2, Calendar, Globe, MapPin, DollarSign,
  Star, TrendingUp, ExternalLink, X,
} from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface LeadDetail {
  id: string;
  source: "audit" | "qualification" | "signup";
  sourceLabel: string;
  raw: Record<string, unknown>;
}

interface LeadDetailDialogProps {
  lead: LeadDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatValue = (key: string, value: unknown): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  if (typeof value === "number") {
    if (key.toLowerCase().includes("loss") || key.toLowerCase().includes("revenue") || key.toLowerCase().includes("profit") || key.toLowerCase().includes("cost") || key.toLowerCase().includes("value") || key.toLowerCase().includes("gain")) {
      return `$${value.toLocaleString()}`;
    }
    if (key.toLowerCase().includes("rate") || key.toLowerCase().includes("percentage") || key.toLowerCase().includes("percent")) {
      return `${value}%`;
    }
    return value.toLocaleString();
  }
  // Try to detect dates
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    try { return format(new Date(value), "MMM d, yyyy 'at' h:mm a"); } catch { return value; }
  }
  return String(value);
};

const labelFromKey = (key: string): string => {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Group keys by category for better organization
const categorizeKeys = (source: string, keys: string[]) => {
  const contact = ["first_name", "last_name", "contact_name", "email", "phone", "company_name"];
  const business = ["industry", "current_call_method", "plan_type", "payment_status", "employee_count", "location", "services", "current_phone_system", "average_calls_per_day"];
  const financial = ["avg_profit_per_customer", "annual_loss", "monthly_loss", "daily_loss", "annual_lost_revenue", "monthly_lost_revenue", "daily_lost_revenue", "annual_recovered_revenue", "monthly_recovered_revenue", "monthly_net_gain", "annual_net_gain", "roi_percentage", "avg_project_value", "customer_acquisition_cost", "lifetime_value", "new_clients_per_month", "new_customers_per_month", "missed_calls_per_week", "missed_calls_per_day", "inbound_calls_per_day", "clients_per_month", "total_customers_per_month"];
  const audit = ["ai_readiness_score", "score_tier", "overall_grade", "lead_conversion_grade", "contact_accessibility_grade", "automation_readiness_grade", "customer_experience_grade", "ai_impact_potential_grade", "recommended_solutions", "website_url", "website_visits_per_month", "website_knowledge", "visitor_lead_conversion", "speed_of_followup", "after_hours_importance", "entry_path", "text_preference", "phone_preference", "customer_source_split", "traffic_estimate", "monthly_website_leads", "percent_from_website", "lead_close_rate", "followup_completion_rate", "messaging_preference_rate"];
  const qualification = ["is_qualified", "is_high_value", "selected_pain_points", "pain_points", "notes"];
  const meta = ["id", "created_at", "updated_at", "ghl_sent", "ghl_sent_at", "completed_full_audit", "quick_result_shown", "utm_source", "utm_campaign", "utm_medium", "website_analysis", "lost_revenue_breakdown", "recovery_calculations", "roi_metrics", "stripe_customer_id", "stripe_payment_intent_id", "stripe_subscription_id", "appointment_scheduled", "appointment_date", "appointment_notes", "wants_call_first", "created_by_email"];

  const groups: { label: string; icon: React.ReactNode; keys: string[] }[] = [];
  const contactKeys = keys.filter((k) => contact.includes(k));
  const businessKeys = keys.filter((k) => business.includes(k));
  const financialKeys = keys.filter((k) => financial.includes(k));
  const auditKeys = keys.filter((k) => audit.includes(k));
  const qualKeys = keys.filter((k) => qualification.includes(k));
  const metaKeys = keys.filter((k) => meta.includes(k));
  const otherKeys = keys.filter((k) => ![...contact, ...business, ...financial, ...audit, ...qualification, ...meta].includes(k));

  if (contactKeys.length) groups.push({ label: "Contact Info", icon: <Mail className="h-4 w-4" />, keys: contactKeys });
  if (businessKeys.length) groups.push({ label: "Business Details", icon: <Building2 className="h-4 w-4" />, keys: businessKeys });
  if (financialKeys.length) groups.push({ label: "Financial Metrics", icon: <DollarSign className="h-4 w-4" />, keys: financialKeys });
  if (auditKeys.length) groups.push({ label: "Audit Results", icon: <Star className="h-4 w-4" />, keys: auditKeys });
  if (qualKeys.length) groups.push({ label: "Qualification", icon: <TrendingUp className="h-4 w-4" />, keys: qualKeys });
  if (otherKeys.length) groups.push({ label: "Other", icon: <Globe className="h-4 w-4" />, keys: otherKeys });
  if (metaKeys.length) groups.push({ label: "Metadata", icon: <Calendar className="h-4 w-4" />, keys: metaKeys });

  return groups;
};

const sourceBadgeClass: Record<string, string> = {
  audit: "bg-primary/10 text-primary border-primary/20",
  qualification: "bg-accent/10 text-accent-foreground border-accent/20",
  signup: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
};

const LeadDetailDialog = ({ lead, open, onOpenChange }: LeadDetailDialogProps) => {
  if (!lead) return null;

  const raw = lead.raw;
  const allKeys = Object.keys(raw);
  const groups = categorizeKeys(lead.source, allKeys);

  const name = lead.source === "audit"
    ? `${raw.first_name || ""} ${raw.last_name || ""}`.trim()
    : String(raw.contact_name || raw.company_name || "Unknown");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold text-foreground">
                {name}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={sourceBadgeClass[lead.source]}>
                  {lead.sourceLabel}
                </Badge>
                {raw.industry && (
                  <Badge variant="secondary" className="text-xs">{String(raw.industry)}</Badge>
                )}
                {raw.score_tier && (
                  <Badge variant="secondary" className="text-xs">Tier: {String(raw.score_tier)}</Badge>
                )}
                {raw.is_qualified && (
                  <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400">Qualified</Badge>
                )}
                {raw.is_high_value && (
                  <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-700 dark:text-amber-400">High Value</Badge>
                )}
                {raw.payment_status && (
                  <Badge variant="secondary" className="text-xs">{String(raw.payment_status)}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Quick contact row */}
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            {raw.email && (
              <a href={`mailto:${raw.email}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                <Mail className="h-3.5 w-3.5" /> {String(raw.email)}
              </a>
            )}
            {raw.phone && (
              <a href={`tel:${raw.phone}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                <Phone className="h-3.5 w-3.5" /> {String(raw.phone)}
              </a>
            )}
            {raw.company_name && (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" /> {String(raw.company_name)}
              </span>
            )}
          </div>
        </DialogHeader>

        <Separator className="mt-4" />

        <ScrollArea className="max-h-[60vh] p-6 pt-4">
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  {group.icon} {group.label}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {group.keys.map((key) => {
                    const val = raw[key];
                    const formatted = formatValue(key, val);
                    const isJson = typeof val === "object" && val !== null;

                    return (
                      <div key={key} className={isJson ? "sm:col-span-2" : ""}>
                        <p className="text-xs text-muted-foreground">{labelFromKey(key)}</p>
                        {isJson ? (
                          <pre className="text-xs text-foreground bg-muted/50 rounded p-2 mt-1 overflow-x-auto max-h-40">
                            {formatted}
                          </pre>
                        ) : (
                          <p className="text-sm text-foreground font-medium">{formatted}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailDialog;
