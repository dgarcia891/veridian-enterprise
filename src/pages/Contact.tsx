import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useAnalytics } from "@/hooks/useAnalytics";
import { notifyAdmin } from "@/lib/notifyAdmin";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  company: z.string().trim().max(200, "Company name too long").optional(),
  phone: z.string().trim().max(20, "Phone number too long").optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
});

const Contact = () => {
  const { toast } = useToast();
  const { trackEvent, trackCTAClick } = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailRevealed, setEmailRevealed] = useState(false);
  const [revealEmail, setRevealEmail] = useState("");

  const handleRevealEmail = () => {
    // Track Intent
    trackCTAClick("Reveal Email", "Contact Page");

    const emailValidation = z.string().trim().email();
    const validation = emailValidation.safeParse(revealEmail);

    if (!validation.success) {
      // Track Failure
      trackEvent("form_error", {
        category: "engagement",
        metadata: { form: "email_reveal", error: "invalid_email" }
      });

      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address to view our contact email.",
      });
      return;
    }

    // Track Success
    trackEvent("form_success", {
      category: "engagement",
      metadata: { form: "email_reveal" }
    });

    setEmailRevealed(true);
    toast({
      title: "Email Revealed",
      description: "Thank you! Our email address is now visible.",
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track Intent
    const formData = new FormData(e.currentTarget);
    trackCTAClick("Send Message", "Contact Page Form");

    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company') || undefined,
      phone: formData.get('phone') || undefined,
      message: formData.get('message')
    };

    // Validate input data
    const validation = contactSchema.safeParse(rawData);
    if (!validation.success) {
      const firstError = validation.error.issues[0];

      // Track Failure
      trackEvent("form_error", {
        category: "engagement",
        metadata: { form: "contact_page", error: firstError.message }
      });

      toast({
        variant: "destructive",
        title: "Validation Error",
        description: firstError.message,
      });
      setIsSubmitting(false);
      return;
    }

    // Track Success Intent
    trackEvent("form_success", {
      category: "engagement",
      metadata: { form: "contact_page" }
    });

    const data = validation.data;

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxD8tEPF_wJtD2k9MXHqZuLEYNF5d2OTg5u06KCjfqfnPrDSlYwKRswWEVi82ORdoEm/exec', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you within 24 hours.",
        });
        e.currentTarget.reset();
      }

      // Fire-and-forget email notification
      notifyAdmin("new_lead", {
        firstName: data.name,
        email: data.email,
        phone: data.phone || "",
        companyName: data.company || "",
        source: "contact_page",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Schedule Free Demo | AI Agents 3000</title>
        <meta name="description" content="Contact AI Agents 3000 for a free demo of our AI voice receptionist service. Call +1 661-263-4388 or email sales@aiagents3000.com. Santa Clarita, CA." />
        <link rel="canonical" href="https://veridian.lovable.app/contact" />
        <meta property="og:title" content="Contact Us - Schedule Free Demo | AI Agents 3000" />
        <meta property="og:description" content="Get started with AI voice receptionist. Schedule a free demo today. Call +1 661-263-4388." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://veridian.lovable.app/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us - Schedule Free Demo | AI Agents 3000" />
        <meta name="twitter:description" content="Get started with AI voice receptionist. Schedule a free demo today." />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get Started Today</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ready to never miss another call? Contact us for a free demo and see how our Voice AI Receptionist can transform your business.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="glass-card p-8 rounded-3xl">
                <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input name="name" required placeholder="Your name" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input name="email" type="email" required placeholder="your@email.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <Input name="company" placeholder="Your company name" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input name="phone" type="tel" placeholder="+1 661 523 0269" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea name="message" required placeholder="Tell us about your needs..." rows={4} />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>

              <div className="space-y-8">
                <div className="glass-card p-6 rounded-2xl border border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
                  <MessageSquare className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Chat with Rosie</h3>
                  <p className="text-muted-foreground">Our AI assistant is ready to help! Click the chat widget in the bottom right corner to get instant answers.</p>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                  <Mail className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  {emailRevealed ? (
                    <a
                      href="mailto:sales@aiagents3000.com"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      sales@aiagents3000.com
                    </a>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-sm">
                        Enter your email to view our contact address
                      </p>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={revealEmail}
                          onChange={(e) => setRevealEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRevealEmail()}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleRevealEmail}
                          size="sm"
                          className="shrink-0"
                        >
                          Reveal
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="glass-card p-6 rounded-2xl">
                  <Phone className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Phone</h3>
                  <a href="tel:+16615230269" className="text-muted-foreground hover:text-foreground transition-colors">
                    +1 661 523 0269
                  </a>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                  <MapPin className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Office</h3>
                  <p className="text-muted-foreground">Santa Clarita, CA</p>
                </div>
              </div>
            </div>

            {/* Blog CTA */}
            <div className="glass-card p-8 rounded-2xl border border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 text-center mt-16">
              <h2 className="text-2xl font-bold mb-4">Want to Learn More?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Check out our blog for insights on AI voice technology, ROI calculations, and success stories from businesses like yours.
              </p>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center glass-button px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
              >
                Read Our Blog
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
