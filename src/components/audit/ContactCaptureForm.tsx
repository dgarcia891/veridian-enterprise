import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContactInfo } from "@/types/audit";
import { Loader2 } from "lucide-react";
import { notifyAdmin } from "@/lib/notifyAdmin";
import { useRateLimit } from "@/hooks/useRateLimit";

interface ContactCaptureFormProps {
  onSubmit: (contact: ContactInfo) => Promise<void>;
}

const ContactCaptureForm = ({ onSubmit }: ContactCaptureFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [honeypot, setHoneypot] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
  });

  const { trackCTAClick, trackEvent } = useAnalytics();
  const { checkRateLimit, recordAttempt } = useRateLimit({
    maxAttempts: 3,
    windowMs: 5 * 60 * 1000,
    storageKey: "rl_audit_contact",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limit check
    const { allowed, retryAfterMs } = checkRateLimit();
    if (!allowed) {
      const minutes = Math.ceil(retryAfterMs / 60000);
      toast({
        title: "Too many attempts",
        description: `Please wait ${minutes} minute${minutes > 1 ? "s" : ""} before trying again.`,
        variant: "destructive",
      });
      return;
    }

    // Track Intent
    trackCTAClick("Claim My Audit Results", "Contact Capture Form");

    const isNameMissing = !formData.firstName.trim() || !formData.lastName.trim();
    const isEmailMissing = !formData.email.trim();

    if (isEmailMissing || isNameMissing) {
      // Track Validation Failure
      trackEvent("form_error", {
        category: "engagement",
        metadata: {
          form: "contact_capture",
          missing_fields: [
            isNameMissing ? "name" : null,
            isEmailMissing ? "email" : null
          ].filter(Boolean).join(", ")
        }
      });

      toast({
        title: "Required Fields",
        description: "Please enter your name and email to receive your report.",
        variant: "destructive"
      });
      return;
    }

    // Track Success Intent (Pre-submit)
    trackEvent("audit_intent_success", {
      category: "engagement",
      metadata: { form: "contact_capture", has_phone: !!formData.phone.trim() }
    });

    setIsLoading(true);
    try {
      recordAttempt();
      await onSubmit(formData);
      // Fire-and-forget email notification
      notifyAdmin("new_lead", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        entry_path: "contact_capture",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isValid = Object.values(formData).every(value => value.trim() !== "");

  return (
    <Card className="glass-card">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl md:text-4xl font-bold">
          Get Your Personalized AI Audit Report
        </CardTitle>
        <CardDescription className="text-lg mt-2">
          Enter your details to receive your comprehensive analysis
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Your Report...
              </>
            ) : (
              "Generate My Audit Report"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactCaptureForm;
