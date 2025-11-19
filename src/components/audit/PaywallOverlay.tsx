import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContactInfo } from "@/pages/AIAudit";
import { Loader2, Lock } from "lucide-react";

interface PaywallOverlayProps {
  onSubmit: (contact: ContactInfo) => Promise<void>;
}

const PaywallOverlay = ({ onSubmit }: PaywallOverlayProps) => {
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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-background/95 backdrop-blur-lg animate-in fade-in slide-in-from-bottom duration-500">
      <div className="container max-w-xl mx-auto px-4 mb-8">
        <Card className="glass-card shadow-2xl border-2 border-primary/20">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold">
              Unlock Your Full Report
            </CardTitle>
            <CardDescription className="text-lg">
              Enter your details to access your personalized AI readiness analysis
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
                    Unlocking Your Report...
                  </>
                ) : (
                  "View My Full Report"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaywallOverlay;
