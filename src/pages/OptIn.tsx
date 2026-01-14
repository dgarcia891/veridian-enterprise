import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Mail, Phone, CheckCircle } from "lucide-react";

const OptIn = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Stay Connected
            </h1>
            <p className="text-lg text-muted-foreground">
              Get exclusive updates, insights, and special offers delivered directly to you.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <form className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-base">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="email-consent"
                    checked={emailConsent}
                    onCheckedChange={(checked) => setEmailConsent(checked as boolean)}
                  />
                  <label
                    htmlFor="email-consent"
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    I agree to receive marketing emails from AiAgents3000. You can unsubscribe at any time.
                  </label>
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-base">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12"
                />
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="sms-consent"
                    checked={smsConsent}
                    onCheckedChange={(checked) => setSmsConsent(checked as boolean)}
                  />
                  <label
                    htmlFor="sms-consent"
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    I agree to receive SMS messages from AiAgents3000. Message and data rates may apply. Reply STOP to opt out.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="button"
                className="w-full h-12 text-base"
                size="lg"
              >
                Subscribe Now
              </Button>

              {/* Privacy Note */}
              <p className="text-xs text-center text-muted-foreground">
                We respect your privacy. Your information will never be shared with third parties.
              </p>
            </form>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Exclusive Updates</h3>
              <p className="text-sm text-muted-foreground">
                Be the first to know about new features and offerings
              </p>
            </div>
            <div className="text-center p-6">
              <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Special Offers</h3>
              <p className="text-sm text-muted-foreground">
                Get access to subscriber-only promotions and discounts
              </p>
            </div>
            <div className="text-center p-6">
              <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Industry Insights</h3>
              <p className="text-sm text-muted-foreground">
                Receive valuable tips and AI industry news
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OptIn;
