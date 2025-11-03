import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OpportunityCard } from "@/components/ai-insight/OpportunityCard";
import { ROIBreakdown } from "@/components/ai-insight/ROIBreakdown";
import { OutreachTemplates } from "@/components/ai-insight/OutreachTemplates";
import { PaywallOverlay } from "@/components/ai-insight/PaywallOverlay";
import { useAIReport, BusinessData } from "@/hooks/useAIReport";
import { Loader2, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const formSchema = z.object({
  websiteUrl: z.string().url({ message: "Please enter a valid website URL" }),
  businessName: z.string().optional(),
  industry: z.string().min(1, { message: "Please select an industry" }),
  contactName: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email" }).optional().or(z.literal("")),
  phone: z.string().optional(),
});

interface AIInsightGeneratorProps {
  paywallMode?: boolean;
  isPaid?: boolean;
  onUpgradeClick?: () => void;
}

export const AIInsightGenerator: React.FC<AIInsightGeneratorProps> = ({
  paywallMode = false,
  isPaid = false,
  onUpgradeClick
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = React.useRef<HTMLDivElement>(null);
  const { reportData, isGenerating, generateReport } = useAIReport();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteUrl: "",
      businessName: "",
      industry: "",
      contactName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const businessData: BusinessData = {
      websiteUrl: values.websiteUrl,
      businessName: values.businessName || new URL(values.websiteUrl).hostname,
      industry: values.industry,
      contactName: values.contactName,
      email: values.email,
      phone: values.phone,
    };

    generateReport(businessData);
    toast.success("Generating your personalized AI report...");
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !reportData) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${reportData.business.name}-AI-Report.pdf`);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (reportData) {
    const showPaywall = paywallMode && !isPaid;
    const visibleOpportunities = showPaywall ? reportData.opportunities.slice(0, 2) : reportData.opportunities;

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold">Your AI Growth Report</h2>
            <p className="text-muted-foreground">Generated for {reportData.business.name}</p>
          </div>
          {!showPaywall && (
            <Button onClick={handleDownloadPDF} disabled={isDownloading} size="lg">
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF Report
                </>
              )}
            </Button>
          )}
        </div>

        <div ref={reportRef} className="space-y-8">
          <div className="relative">
            <div className={showPaywall ? "space-y-4" : "grid md:grid-cols-2 gap-6"}>
              {visibleOpportunities.map((opportunity, index) => (
                <OpportunityCard key={index} {...opportunity} />
              ))}
            </div>

            {showPaywall && (
              <>
                <div className="mt-6 pointer-events-none blur-sm opacity-60 select-none space-y-4">
                  {reportData.opportunities.slice(2, 4).map((opportunity, index) => (
                    <OpportunityCard key={index + 2} {...opportunity} />
                  ))}
                </div>
                <PaywallOverlay onUnlockClick={onUpgradeClick!} />
              </>
            )}
          </div>

          {!showPaywall && (
            <>
              <div className="glass-card rounded-3xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-3">Executive Summary</h3>
                <p className="text-muted-foreground">{reportData.executiveSummary}</p>
              </div>
              <ROIBreakdown roi={reportData.roi} businessName={reportData.business.name} />
              <OutreachTemplates 
                businessName={reportData.business.name}
                industry={reportData.business.industry}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-3xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Discover Your AI Opportunities</h2>
          <p className="text-muted-foreground">
            Get a personalized report showing exactly how AI can boost your business revenue and efficiency.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL *</Label>
            <Input
              id="websiteUrl"
              placeholder="https://yourbusiness.com"
              {...form.register("websiteUrl")}
            />
            {form.formState.errors.websiteUrl && (
              <p className="text-sm text-destructive">{form.formState.errors.websiteUrl.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Your Business Name"
                {...form.register("businessName")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select onValueChange={(value) => form.setValue("industry", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurants">Restaurants</SelectItem>
                  <SelectItem value="medical">Medical Offices</SelectItem>
                  <SelectItem value="contractors">Contractors</SelectItem>
                  <SelectItem value="professional">Professional Services</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="legal">Legal Services</SelectItem>
                  <SelectItem value="salons">Salons & Spas</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.industry && (
                <p className="text-sm text-destructive">{form.formState.errors.industry.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Optional: Provide your contact details to receive the report via email</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Your Name</Label>
                <Input
                  id="contactName"
                  placeholder="John Doe"
                  {...form.register("contactName")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  {...form.register("phone")}
                />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full text-lg py-6" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Your Report...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Free Report
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
