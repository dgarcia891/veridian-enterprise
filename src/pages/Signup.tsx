import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import SkipToContent from "@/components/SkipToContent";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const PLAN_OPTIONS = [
  { value: "starter", label: "Starter — $99/mo", price: "$99/month" },
  { value: "growth", label: "Growth — $199/mo", price: "$199/month" },
  { value: "professional", label: "Professional — $600/mo", price: "$600/month" },
];

const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const preselectedPlan = searchParams.get("plan") || "growth";

  const [form, setForm] = useState({
    contactName: "",
    email: "",
    phone: "",
    companyName: "",
    industry: "",
    plan: preselectedPlan,
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.contactName || !form.email || !form.phone || !form.companyName) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // 1. Insert into customer_signups
      const { data: signup, error: insertError } = await supabase
        .from("customer_signups")
        .insert({
          contact_name: form.contactName,
          email: form.email,
          phone: form.phone,
          company_name: form.companyName,
          industry: form.industry || null,
          plan_type: form.plan,
          payment_status: "pending",
        })
        .select("id")
        .single();

      if (insertError) throw new Error(insertError.message);

      // 2. Invoke create-payment edge function
      const { data, error: fnError } = await supabase.functions.invoke("create-payment", {
        body: {
          signupId: signup.id,
          planType: form.plan,
          email: form.email,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      // 3. Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      toast({
        title: "Something went wrong",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up — AI Voice Receptionist | AI Agents 3000</title>
        <meta name="description" content="Sign up for an AI Voice Receptionist plan and get started in minutes." />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-lg mx-auto px-4">
            <Card className="glass-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Get Started</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Fill in your details and proceed to checkout
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan">Plan</Label>
                    <Select value={form.plan} onValueChange={(v) => handleChange("plan", v)}>
                      <SelectTrigger id="plan">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PLAN_OPTIONS.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">Full Name *</Label>
                    <Input
                      id="contactName"
                      value={form.contactName}
                      onChange={(e) => handleChange("contactName", e.target.value)}
                      placeholder="John Smith"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="john@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={form.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      placeholder="Acme Inc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={form.industry} onValueChange={(v) => handleChange("industry", v)}>
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {["HVAC", "Plumbing", "Electrical", "Roofing", "Medical", "Legal", "Restaurant", "Real Estate", "Other"].map((i) => (
                          <SelectItem key={i} value={i.toLowerCase()}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full mt-6" disabled={loading} size="lg">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Continue to Checkout"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-2">
                    You'll be redirected to our secure payment processor.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Signup;
