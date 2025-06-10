
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
            Get in <span className="font-semibold">Touch</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Ready to transform your digital experience? Reach out to our team and let's discuss how Lumina can help you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-white mb-8">Send us a message</h3>
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
                <label className="block text-white/80 text-sm mb-2">Email</label>
                <Input 
                  type="email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Subject</label>
                <Input 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="How can we help you?"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm mb-2">Message</label>
                <Textarea 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                  placeholder="Tell us about your project..."
                />
              </div>
              
              <Button className="w-full bg-white text-black rounded-full py-3 font-medium hover:bg-white/90 transition-all duration-300">
                Send Message
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
              <p className="text-white/70">hello@lumina.com</p>
              <p className="text-white/70">support@lumina.com</p>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-white mr-4" />
                <h4 className="text-xl font-semibold text-white">Phone</h4>
              </div>
              <p className="text-white/70">+1 (555) 123-4567</p>
              <p className="text-white/70">+1 (555) 987-6543</p>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-white mr-4" />
                <h4 className="text-xl font-semibold text-white">Office</h4>
              </div>
              <p className="text-white/70">
                123 Innovation Drive<br />
                San Francisco, CA 94107<br />
                United States
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
