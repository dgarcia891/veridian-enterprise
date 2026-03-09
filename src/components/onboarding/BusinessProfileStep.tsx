import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";

interface BusinessProfileData {
  businessName: string;
  industry: string;
  servicesOffered: string[];
}

interface Props {
  data: BusinessProfileData;
  onChange: (data: BusinessProfileData) => void;
  onNext: () => void;
}

const SERVICE_SUGGESTIONS = [
  "Emergency Repair", "Installation", "Maintenance", "Consultation",
  "Estimates", "Inspection", "Follow-up Care", "Scheduling",
];

const BusinessProfileStep = ({ data, onChange, onNext }: Props) => {
  const [serviceInput, setServiceInput] = useState("");

  const addService = (service: string) => {
    const trimmed = service.trim();
    if (trimmed && !data.servicesOffered.includes(trimmed)) {
      onChange({ ...data, servicesOffered: [...data.servicesOffered, trimmed] });
    }
    setServiceInput("");
  };

  const removeService = (service: string) => {
    onChange({ ...data, servicesOffered: data.servicesOffered.filter((s) => s !== service) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input
          id="businessName"
          value={data.businessName}
          onChange={(e) => onChange({ ...data, businessName: e.target.value })}
          placeholder="Your Business Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select value={data.industry} onValueChange={(v) => onChange({ ...data, industry: v })}>
          <SelectTrigger id="industry"><SelectValue placeholder="Select industry" /></SelectTrigger>
          <SelectContent>
            {["HVAC", "Plumbing", "Electrical", "Roofing", "Medical", "Legal", "Restaurant", "Real Estate", "Other"].map((i) => (
              <SelectItem key={i} value={i.toLowerCase()}>{i}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="servicesInput">Services You Offer</Label>
        <div className="flex gap-2">
          <Input
            id="servicesInput"
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
            placeholder="Add a service..."
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService(serviceInput))}
          />
          <Button type="button" variant="outline" onClick={() => addService(serviceInput)}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {data.servicesOffered.map((s) => (
            <Badge key={s} variant="secondary" className="gap-1 cursor-pointer" onClick={() => removeService(s)}>
              {s} <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
        {data.servicesOffered.length === 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-xs text-muted-foreground">Suggestions:</span>
            {SERVICE_SUGGESTIONS.map((s) => (
              <Badge key={s} variant="outline" className="cursor-pointer text-xs" onClick={() => addService(s)}>
                + {s}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button className="w-full" onClick={onNext} disabled={!data.businessName}>
        Continue
      </Button>
    </div>
  );
};

export default BusinessProfileStep;
