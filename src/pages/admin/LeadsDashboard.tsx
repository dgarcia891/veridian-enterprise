import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  ArrowLeft, Loader2, Search, ArrowUpDown, Users, FileText, CreditCard,
  ClipboardList, Mail, Phone, Building2, Calendar,
} from "lucide-react";
import { format } from "date-fns";
import LeadDetailDialog, { type LeadDetail } from "@/components/admin/LeadDetailDialog";

type SortField = "date" | "name" | "email" | "source";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 25;

interface UnifiedLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: "audit" | "qualification" | "signup" | "contact";
  sourceLabel: string;
  industry: string;
  date: string;
  meta: Record<string, string | number | null>;
  raw: Record<string, unknown>;
}

const LeadsDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useIsAdmin();
  const [leads, setLeads] = useState<UnifiedLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedLead, setSelectedLead] = useState<LeadDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/");
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchLeads();
  }, [isAdmin]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const [audits, quals, signups] = await Promise.all([
        supabase.from("ai_audit_submissions").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("qualification_submissions").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("customer_signups").select("*").order("created_at", { ascending: false }).limit(500),
      ]);

      const unified: UnifiedLead[] = [];

      (audits.data || []).forEach((a) => {
        unified.push({
          id: a.id,
          name: `${a.first_name} ${a.last_name}`.trim(),
          email: a.email,
          phone: a.phone,
          company: a.company_name,
          source: "audit",
          sourceLabel: a.entry_path === "roofing" ? "Roofing Audit" : "AI Audit",
          industry: a.industry || "",
          date: a.created_at || "",
          meta: { scoreTier: a.score_tier, annualLoss: a.annual_loss },
          raw: a as unknown as Record<string, unknown>,
        });
      });

      (quals.data || []).forEach((q) => {
        unified.push({
          id: q.id,
          name: q.contact_name || q.company_name,
          email: q.email || "",
          phone: q.phone || "",
          company: q.company_name,
          source: "qualification",
          sourceLabel: "Qualification",
          industry: q.industry || "",
          date: q.created_at || "",
          meta: { qualified: q.is_qualified ? "Yes" : "No", highValue: q.is_high_value ? "Yes" : "No", annualLost: q.annual_lost_revenue },
          raw: q as unknown as Record<string, unknown>,
        });
      });

      (signups.data || []).forEach((s) => {
        unified.push({
          id: s.id,
          name: s.contact_name,
          email: s.email,
          phone: s.phone,
          company: s.company_name,
          source: "signup",
          sourceLabel: "Signup",
          industry: s.industry || "",
          date: s.created_at,
          meta: { plan: s.plan_type, payment: s.payment_status },
          raw: s as unknown as Record<string, unknown>,
        });
      });

      setLeads(unified);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = leads
    .filter((l) => sourceFilter === "all" || l.source === sourceFilter)
    .filter((l) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortField) {
        case "date": return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
        case "name": return dir * a.name.localeCompare(b.name);
        case "email": return dir * a.email.localeCompare(b.email);
        case "source": return dir * a.sourceLabel.localeCompare(b.sourceLabel);
        default: return 0;
      }
    });

  const sourceBadge = (source: UnifiedLead["source"], label: string) => {
    const variants: Record<string, string> = {
      audit: "bg-primary/10 text-primary border-primary/20",
      qualification: "bg-accent/10 text-accent-foreground border-accent/20",
      signup: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      contact: "bg-muted text-muted-foreground border-border",
    };
    return <Badge variant="outline" className={variants[source]}>{label}</Badge>;
  };

  const counts = {
    total: leads.length,
    audits: leads.filter((l) => l.source === "audit").length,
    quals: leads.filter((l) => l.source === "qualification").length,
    signups: leads.filter((l) => l.source === "signup").length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leads Dashboard</h1>
            <p className="text-sm text-muted-foreground">All submissions across every form</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{counts.total}</p>
                <p className="text-xs text-muted-foreground">Total Leads</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{counts.audits}</p>
                <p className="text-xs text-muted-foreground">Audits</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <ClipboardList className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{counts.quals}</p>
                <p className="text-xs text-muted-foreground">Qualifications</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{counts.signups}</p>
                <p className="text-xs text-muted-foreground">Signups</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, company, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="audit">Audits</SelectItem>
              <SelectItem value="qualification">Qualifications</SelectItem>
              <SelectItem value="signup">Signups</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                No leads found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("date")}>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Date
                        {sortField === "date" && <ArrowUpDown className="h-3 w-3" />}
                      </span>
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>
                      <span className="inline-flex items-center gap-1">
                        Name {sortField === "name" && <ArrowUpDown className="h-3 w-3" />}
                      </span>
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("email")}>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> Email
                        {sortField === "email" && <ArrowUpDown className="h-3 w-3" />}
                      </span>
                    </TableHead>
                    <TableHead className="hidden md:table-cell"><Phone className="h-3.5 w-3.5 inline mr-1" />Phone</TableHead>
                    <TableHead className="hidden lg:table-cell"><Building2 className="h-3.5 w-3.5 inline mr-1" />Company</TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("source")}>
                      <span className="inline-flex items-center gap-1">
                        Source {sortField === "source" && <ArrowUpDown className="h-3 w-3" />}
                      </span>
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((lead) => (
                    <TableRow
                      key={`${lead.source}-${lead.id}`}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedLead({ id: lead.id, source: lead.source as "audit" | "qualification" | "signup", sourceLabel: lead.sourceLabel, raw: lead.raw });
                        setDetailOpen(true);
                      }}
                    >
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {lead.date ? format(new Date(lead.date), "MMM d, yyyy") : "—"}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{lead.name || "—"}</TableCell>
                      <TableCell>
                        {lead.email ? (
                          <a href={`mailto:${lead.email}`} className="text-primary hover:underline text-sm">{lead.email}</a>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {lead.phone ? (
                          <a href={`tel:${lead.phone}`} className="text-muted-foreground hover:text-foreground">{lead.phone}</a>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{lead.company || "—"}</TableCell>
                      <TableCell>{sourceBadge(lead.source, lead.sourceLabel)}</TableCell>
                      <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                        {lead.source === "audit" && lead.meta.scoreTier && (
                          <span>Tier: {String(lead.meta.scoreTier)}</span>
                        )}
                        {lead.source === "qualification" && (
                          <span>Qualified: {String(lead.meta.qualified)}</span>
                        )}
                        {lead.source === "signup" && (
                          <span>{String(lead.meta.plan)} · {String(lead.meta.payment)}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Showing {filtered.length} of {leads.length} leads
        </p>
      </div>

      <LeadDetailDialog lead={selectedLead} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
};

export default LeadsDashboard;
