import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContactInfo } from "@/pages/AIAudit";
import { Loader2 } from "lucide-react";

interface ContactCaptureFormProps {
  onSubmit: (contact: ContactInfo) => Promise<void>;
}

const ContactCaptureForm = ({ onSubmit }: ContactCaptureFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
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
