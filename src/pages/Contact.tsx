import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { z } from "zod";
import { useRetellWidget } from "@/hooks/useRetellWidget";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  company: z.string().trim().max(200, "Company name too long").optional(),
  phone: z.string().trim().max(20, "Phone number too long").optional(),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message too long"),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openChat } = useRetellWidget();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
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
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: firstError.message,
      });
      setIsSubmitting(false);
      return;
    }

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
                  <Input name="phone" type="tel" placeholder="+1 661 263 4388" />
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
              <div 
                onClick={openChat}
                className="glass-card p-6 rounded-2xl cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <MessageSquare className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">AI Agent Chat</h3>
                <p className="text-muted-foreground">Chat with Rosie instantly</p>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground">contact@veridian.com</p>
              </div>
              
              <div className="glass-card p-6 rounded-2xl">
                <Phone className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Phone</h3>
                <a href="tel:+16612634388" className="text-muted-foreground hover:text-foreground transition-colors">
                  +1 661 263 4388
                </a>
              </div>
              
              <div className="glass-card p-6 rounded-2xl">
                <MapPin className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Office</h3>
                <p className="text-muted-foreground">Santa Clarita, CA</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
