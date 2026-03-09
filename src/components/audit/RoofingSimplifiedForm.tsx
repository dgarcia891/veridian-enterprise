import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Phone, Building2, TrendingUp } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useToast } from "@/hooks/use-toast";

interface RoofingSimplifiedFormProps {
  onSubmit: (data: {
    businessName: string;
    phone: string;
    callsPerWeek: number;
  }) => void;
}

const RoofingSimplifiedForm = ({ onSubmit }: RoofingSimplifiedFormProps) => {
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [callsPerWeek, setCallsPerWeek] = useState(50);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { trackEvent, trackCTAClick } = useAnalytics();
  const { toast } = useToast();
  const { checkRateLimit, recordAttempt } = useRateLimit({
    maxAttempts: 5,
    windowMs: 5 * 60 * 1000,
    storageKey: "rl_roofing_form",
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!businessName.trim() || businessName.trim().length < 2) {
      newErrors.businessName = "Business name must be at least 2 characters";
    }

    const phoneRegex = /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
    if (!phone.trim() || !phoneRegex.test(phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (callsPerWeek < 1) {
      newErrors.callsPerWeek = "Must be at least 1 call per week";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, silently reject (bot detected)
    if (honeypot) {
      // Fake success for bots
      return;
    }

    // Rate limit check
    const { allowed, retryAfterMs } = checkRateLimit();
    if (!allowed) {
      const minutes = Math.ceil(retryAfterMs / 60000);
      toast({
        variant: "destructive",
        title: "Too many submissions",
        description: `Please wait ${minutes} minute${minutes > 1 ? "s" : ""} before trying again.`,
      });
      return;
    }

    // Track Intent
    trackCTAClick("Show Me What I'm Losing", "Roofing Simplified Form");

    if (validateForm()) {
      recordAttempt();
      trackEvent("audit_intent_success", {
        category: "engagement",
        metadata: { form: "roofing_simplified", businessName }
      });

      onSubmit({
        businessName: businessName.trim(),
        phone: phone.trim(),
        callsPerWeek,
      });
    } else {
      // Track Failure
      const validationErrors = validateForm() ? {} : errors; // This is a bit redundant but safe
      trackEvent("form_error", {
        category: "engagement",
        metadata: {
          form: "roofing_simplified",
          errors: Object.keys(errors).join(", "),
          businessName_length: businessName.length,
          has_phone: !!phone
        }
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          How Many Roofing Calls Are You <span className="text-destructive">Losing</span>?
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Get your free call revenue analysis in 30 seconds
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>✓ No credit card</span>
          <span>✓ Instant results</span>
          <span>✓ 100% free</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg border shadow-lg">
        {/* Business Name */}
        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-base font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Business Name
          </Label>
          <Input
            id="businessName"
            type="text"
            placeholder="ABC Roofing Company"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="text-lg h-12"
          />
          {errors.businessName && (
            <p className="text-sm text-destructive">{errors.businessName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-medium flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="text-lg h-12"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Calls Per Week Slider */}
        <div className="space-y-4">
          <Label htmlFor="calls" className="text-base font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            How many calls do you typically get per week?
          </Label>
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">5 calls</span>
              <span className="text-3xl font-bold text-primary">{callsPerWeek}</span>
              <span className="text-sm text-muted-foreground">200 calls</span>
            </div>
            <Slider
              id="calls"
              min={5}
              max={200}
              step={5}
              value={[callsPerWeek]}
              onValueChange={(value) => setCallsPerWeek(value[0])}
              className="cursor-pointer"
            />
            {callsPerWeek > 150 && (
              <p className="text-sm text-muted-foreground mt-2">
                That's a lot of calls! Our team should talk with you directly about your needs.
              </p>
            )}
          </div>
          {errors.callsPerWeek && (
            <p className="text-sm text-destructive">{errors.callsPerWeek}</p>
          )}
        </div>

        {/* Honeypot field - hidden from real users */}
        <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="roofing-website">Your Website</label>
          <input 
            type="text" 
            id="roofing-website" 
            name="website" 
            tabIndex={-1} 
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full text-lg h-14 font-semibold"
        >
          Show Me What I'm Losing →
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to receive communications about AI solutions for your business.
        </p>
      </form>
    </div>
  );
};

export default RoofingSimplifiedForm;
