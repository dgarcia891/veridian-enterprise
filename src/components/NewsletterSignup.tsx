import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Mail, Download, CheckCircle, Loader2 } from "lucide-react";

const LEAD_MAGNET_URL = "/ai-readiness-checklist.pdf";
const LEAD_MAGNET_TITLE = "AI Readiness Checklist";

interface NewsletterSignupProps {
  variant: "banner" | "inline";
}

const NewsletterSignup = ({ variant }: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers" as any)
        .insert([{
          email: email.trim().toLowerCase(),
          first_name: firstName.trim() || null,
          source_page: window.location.pathname,
        }] as any);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already subscribed! 🎉",
            description: "You're already on our list. Download the checklist below.",
          });
          setIsSuccess(true);
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast({
          title: "You're in! 🎉",
          description: "Check your inbox for the AI Readiness Checklist.",
        });
      }

      trackEvent("newsletter_signup", {
        category: "lead_generation",
        metadata: {
          source_page: window.location.pathname,
          has_first_name: !!firstName.trim(),
        },
      });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "banner") {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          {!isSuccess ? (
            <>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <Download className="w-4 h-4" />
                Free Download
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
                Get Your Free AI Readiness Checklist
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                Discover if your business is ready for AI automation. 15-point checklist used by 500+ businesses to evaluate their AI potential.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <Input
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="sm:w-40"
                  maxLength={50}
                />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                  maxLength={255}
                />
                <Button type="submit" disabled={isLoading} className="gap-2">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Get the Checklist
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                No spam, ever. Unsubscribe anytime.
              </p>
            </>
          ) : (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold text-foreground">You're all set!</h3>
              <p className="text-muted-foreground">Download your free {LEAD_MAGNET_TITLE} now:</p>
              <Button asChild variant="outline" className="gap-2">
                <a href={LEAD_MAGNET_URL} download>
                  <Download className="w-4 h-4" />
                  Download {LEAD_MAGNET_TITLE}
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Inline variant
  return (
    <div className="my-12 glass-card rounded-2xl p-6 sm:p-8 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      {!isSuccess ? (
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-2">
              <Download className="w-4 h-4" />
              Free Resource
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              AI Readiness Checklist
            </h3>
            <p className="text-sm text-muted-foreground">
              15-point checklist to evaluate your business's AI automation potential.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 lg:w-auto">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="sm:w-56"
              maxLength={255}
            />
            <Button type="submit" disabled={isLoading} size="default" className="gap-2 whitespace-nowrap">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Get It Free
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
          <p className="font-semibold text-foreground">Subscribed!</p>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href={LEAD_MAGNET_URL} download>
              <Download className="w-4 h-4" />
              Download Checklist
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default NewsletterSignup;
