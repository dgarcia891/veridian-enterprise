
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Ready to <span className="font-semibold">Transform Your Marketing</span>?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Let our experts design a custom marketing automation campaign that drives real results for your business. Tell us about your goals and we'll create a strategy tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-8">Request Campaign Planning</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/80 text-sm mb-2">First Name</label>
                  <Input 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Last Name</label>
                  <Input 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Business Email</label>
                <Input 
                  type="email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="john@company.com"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Company Name</label>
                <Input 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Your Company"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Industry</label>
                <Input 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="e.g., Healthcare, Real Estate, E-commerce"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Describe your marketing goals and challenges</label>
                <Textarea 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                  placeholder="Tell us about your current marketing efforts, target audience, and what you'd like to achieve..."
                />
              </div>
              
              <Button className="w-full bg-white text-black rounded-full py-3 font-medium hover:bg-white/90 transition-all duration-300">
                Submit Campaign Request
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-white mr-4" />
                <h4 className="text-xl font-semibold text-white">Email</h4>
              </div>
              <p className="text-white/70">hello@veridian.com</p>
              <p className="text-white/70">campaigns@veridian.com</p>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-white mr-4" />
                <h4 className="text-xl font-semibold text-white">Phone</h4>
              </div>
              <p className="text-white/70">+1 (555) 123-GROW</p>
              <p className="text-white/70">+1 (555) 987-MARKET</p>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-white mr-4" />
                <h4 className="text-xl font-semibold text-white">Office</h4>
              </div>
              <p className="text-white/70">
                456 Marketing Boulevard<br />
                Los Angeles, CA 90210<br />
                United States
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <h4 className="text-xl font-semibold text-white mb-4">What to Expect</h4>
              <ul className="space-y-3 text-white/70">
                <li>• Detailed analysis of your current marketing</li>
                <li>• Custom strategy recommendations</li>
                <li>• Platform setup and automation design</li>
                <li>• Ongoing support and optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
