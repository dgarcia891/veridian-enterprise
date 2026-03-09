import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus } from "lucide-react";

const CustomerRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [form, setForm] = useState({ fullName: "", companyName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [signupId, setSignupId] = useState<string | null>(null);
  const [prefilling, setPrefilling] = useState(!!sessionId);

  // Pre-fill form from Stripe session data
  useEffect(() => {
    if (!sessionId) return;

    const fetchSessionData = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-checkout-session", {
          body: { sessionId },
        });
        if (error) throw error;
        if (data) {
          setForm((prev) => ({
            ...prev,
            email: data.email || prev.email,
            companyName: data.companyName || prev.companyName,
            fullName: data.contactName || prev.fullName,
          }));
          setSignupId(data.signupId || null);
        }
      } catch {
        // Non-critical: user can still fill manually
      } finally {
        setPrefilling(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast({ title: "Password too short", description: "Must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: form.fullName, company_name: form.companyName },
        },
      });
      if (error) throw error;

      // Link the customer_signups record to this new user
      if (signupId && authData.user) {
        try {
          await supabase.functions.invoke("link-signup-user", {
            body: { signupId, userId: authData.user.id },
          });
        } catch {
          // Non-critical
        }
      }

      toast({ title: "Account created!", description: "Let's set up your AI agent now." });
      navigate("/onboarding");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (prefilling) {
    return (
      <>
        <Helmet><title>Create Account | AI Agents 3000</title></Helmet>
        <div className="min-h-screen flex flex-col bg-background">
          <Navigation />
          <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Create Account | AI Agents 3000</title></Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>Set up your login to manage your AI agent</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Jane Smith" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" required value={form.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="Acme Corp" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min 6 characters" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  Create Account
                </Button>
              </form>
              <p className="mt-4 text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/customer/login" className="text-primary hover:underline">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CustomerRegister;
