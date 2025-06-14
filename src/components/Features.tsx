
import { Zap, Target, TrendingUp, Users, BarChart3, MessageSquare, Phone, Mail, Calendar, Workflow } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Lead Generation Funnels",
      description: "Convert visitors into customers with high-converting landing pages, forms, and automated follow-up sequences.",
      services: "Our lead generation services include custom landing page design, lead magnet creation, opt-in form optimization, A/B testing, conversion rate optimization, and automated email sequences. We'll help you capture more leads and turn them into paying customers through strategic funnel design and continuous optimization."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "CRM & Pipeline Management",
      description: "Track every lead from first contact to closed deal with our comprehensive customer relationship management system.",
      services: "We provide complete CRM setup and management, including contact organization, deal pipeline creation, automated task assignments, follow-up reminders, sales reporting, and team collaboration tools. Our services ensure no lead falls through the cracks and your sales process runs smoothly from initial contact to conversion."
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Multi-Channel Messaging",
      description: "Reach customers via SMS, email, voice calls, and social media - all from one unified platform.",
      services: "Our messaging services encompass SMS marketing campaigns, email marketing automation, social media messaging integration, voice broadcast campaigns, and unified inbox management. We'll help you maintain consistent communication across all channels while tracking engagement and response rates for optimal results."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Appointment Scheduling",
      description: "Automated booking system with calendar integration, reminders, and no-show reduction features.",
      services: "We offer complete appointment scheduling solutions including calendar integration, automated booking confirmations, reminder sequences via SMS and email, no-show reduction strategies, rescheduling automation, and waitlist management. Perfect for service-based businesses looking to streamline their booking process."
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "Marketing Automation",
      description: "Set up complex workflows that nurture leads and customers automatically based on their behavior.",
      services: "Our automation services include email drip campaigns, behavioral triggers, lead scoring systems, customer journey mapping, abandoned cart recovery, re-engagement campaigns, and personalized content delivery. We'll create sophisticated workflows that guide prospects through your sales funnel automatically."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Reporting",
      description: "Track ROI, conversion rates, and campaign performance with detailed analytics and custom reports.",
      services: "We provide comprehensive analytics setup including conversion tracking, ROI analysis, campaign performance monitoring, custom dashboard creation, automated reporting, and data visualization. You'll receive regular insights into what's working and recommendations for improvement based on real data."
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Voice & Call Tracking",
      description: "Local phone numbers, call recording, and call tracking to monitor and improve your phone conversions.",
      services: "Our call tracking services include local phone number setup, call recording and transcription, call scoring, missed call text-back automation, voicemail drop campaigns, and detailed call analytics. We'll help you optimize your phone-based marketing and never miss a potential customer."
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Marketing",
      description: "Professional email campaigns with advanced segmentation, A/B testing, and delivery optimization.",
      services: "We offer full-service email marketing including campaign design and copywriting, list segmentation, automated sequences, A/B testing, deliverability optimization, spam compliance, and performance analytics. From welcome series to promotional campaigns, we'll help you maximize your email marketing ROI."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Website & Funnel Builder",
      description: "Create stunning websites and sales funnels with our drag-and-drop builder - no coding required.",
      services: "Our web development services include responsive website design, sales funnel creation, landing page optimization, mobile optimization, speed optimization, SEO setup, integration with marketing tools, and ongoing maintenance. We'll create high-converting web properties that drive results for your business."
    }
  ];

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Complete <span className="font-semibold">Marketing Suite</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Everything you need to attract, convert, and retain customers - powered by our cutting-edge marketing automation platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 group cursor-pointer"
              onClick={() => setSelectedFeature(index)}
            >
              <div className="text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-white transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <Dialog open={selectedFeature !== null} onOpenChange={() => setSelectedFeature(null)}>
          <DialogContent className="max-w-2xl bg-black/90 backdrop-blur-md border border-white/20 text-white">
            {selectedFeature !== null && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-white flex items-center gap-3">
                    {features[selectedFeature].icon}
                    {features[selectedFeature].title}
                  </DialogTitle>
                  <DialogDescription className="text-white/70 text-lg mt-4">
                    {features[selectedFeature].services}
                  </DialogDescription>
                </DialogHeader>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Features;
