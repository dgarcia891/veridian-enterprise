import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone, MessageSquare, Calendar, Zap, Shield, TrendingUp } from "lucide-react";
import { Helmet } from "react-helmet-async";

const faqCategories = [
  {
    title: "AI Agent Capabilities",
    icon: Zap,
    questions: [
      {
        q: "What can an AI agent actually do for my business?",
        a: "Our AI agents are 24/7 virtual team members that can handle inbound calls, answer customer questions, qualify leads, schedule appointments, take orders, process payments, provide product information, and follow up with customers automatically. They work while you sleep, ensuring no opportunity is ever missed."
      },
      {
        q: "How natural are the conversations with the AI agent?",
        a: "Our AI agents use advanced natural language processing to have human-like conversations. They understand context, handle interruptions, remember customer preferences, and can switch between topics seamlessly. Most customers can't tell they're speaking with an AI rather than a human representative."
      },
      {
        q: "Can the AI agent handle multiple calls simultaneously?",
        a: "Yes! Unlike human staff, AI agents can handle unlimited simultaneous conversations without any degradation in quality. Whether you receive 1 call or 1,000 calls at the same time, every customer gets immediate, personalized attention."
      },
      {
        q: "What languages does the AI agent support?",
        a: "Our AI agents support 30+ languages including English, Spanish, French, German, Mandarin, Japanese, and more. They can automatically detect the caller's language and switch seamlessly, making your business truly global."
      },
      {
        q: "How does the AI agent learn about my business?",
        a: "Setup takes just 10 minutes. You provide information about your products, services, prices, and common questions. The AI agent then uses this knowledge base combined with machine learning to handle conversations intelligently. It continuously improves by learning from every interaction."
      }
    ]
  },
  {
    title: "Integrations & Automation",
    icon: MessageSquare,
    questions: [
      {
        q: "What systems can the AI agent integrate with?",
        a: "Our AI agents integrate with all major CRMs (Salesforce, HubSpot, Zoho), calendar systems (Google Calendar, Outlook, Calendly), payment processors (Stripe, PayPal, Square), email marketing platforms (Mailchimp, ActiveCampaign), SMS services, and 5,000+ apps via Zapier and Make.com."
      },
      {
        q: "Can it sync with my existing calendar?",
        a: "Absolutely! The AI agent connects directly to your Google Calendar, Outlook, or any CalDAV-compatible calendar. It checks real-time availability, books appointments instantly, sends confirmation messages, and even handles rescheduling requests automatically."
      },
      {
        q: "How does CRM integration work?",
        a: "Every call is automatically logged in your CRM with full conversation transcripts, call recordings, lead scores, and next steps. Contact information is created or updated automatically, and follow-up tasks are assigned based on your workflows. Your team always has complete visibility."
      },
      {
        q: "Can it integrate with my website and landing pages?",
        a: "Yes! Add our widget to any website with a single line of code. The AI agent can also be embedded in landing pages, integrate with chatbots, trigger from forms, and even reach out proactively based on visitor behavior."
      },
      {
        q: "What about e-commerce platforms?",
        a: "We integrate with Shopify, WooCommerce, BigCommerce, and Magento. The AI agent can check inventory, provide product recommendations, process orders, handle returns, and answer product-specific questions by accessing your store's data in real-time."
      }
    ]
  },
  {
    title: "Call Management & Features",
    icon: Phone,
    questions: [
      {
        q: "Can customers request to speak with a human?",
        a: "Of course! While our AI agents resolve 85% of inquiries independently, customers can always request human assistance. The agent seamlessly transfers calls to your team with full context, or takes detailed messages if no one is available."
      },
      {
        q: "What happens if the AI doesn't know the answer?",
        a: "The AI agent is programmed to handle uncertainty gracefully. It will either look up the information in your knowledge base, offer to connect the customer with your team, take a message, or schedule a callback. It never makes up information or provides incorrect answers."
      },
      {
        q: "Can it handle appointment scheduling?",
        a: "Yes! The AI agent checks your real-time availability, offers available time slots, books appointments instantly, sends confirmations via SMS and email, sends reminders before the appointment, and can handle rescheduling or cancellation requests 24/7."
      },
      {
        q: "Does it handle inbound and outbound calls?",
        a: "Yes to both! The AI agent answers all inbound calls instantly and can also make outbound calls for appointment reminders, follow-ups, lead qualification, customer surveys, payment reminders, and re-engagement campaigns."
      },
      {
        q: "Can it qualify leads automatically?",
        a: "Absolutely! The AI agent asks qualifying questions based on your criteria, scores leads in real-time, routes hot leads to your sales team immediately, nurtures cold leads with follow-up sequences, and updates your CRM with detailed lead intelligence."
      }
    ]
  },
  {
    title: "Pricing & ROI",
    icon: TrendingUp,
    questions: [
      {
        q: "How much does it cost compared to hiring staff?",
        a: "Our AI agents cost a fraction of a human employee. While a full-time receptionist costs $30,000-$45,000/year plus benefits, our AI agents start at just $297/month and work 24/7/365 without vacation, sick days, or overtime. Most businesses see 10-20x ROI within the first 3 months."
      },
      {
        q: "Is there a setup fee?",
        a: "Monthly plans include a $450 setup fee. However, when you commit to an annual plan, the setup fee is completely waived! We include free onboarding, custom configuration, integration setup, and training to ensure your AI agent is perfectly aligned with your business needs."
      },
      {
        q: "What's included in the monthly price?",
        a: "Everything! Unlimited calls, all integrations, CRM features, analytics dashboard, regular updates, 24/7 technical support, call recordings, transcripts, and continuous AI improvements. No hidden fees or per-minute charges."
      },
      {
        q: "How quickly will I see ROI?",
        a: "Most businesses recover their investment in the first month. By capturing every call (no more missed opportunities), reducing labor costs, and increasing conversion rates, the average client sees $5-10 in revenue for every $1 spent on our AI agent service."
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes! We offer month-to-month plans with no long-term contracts. You can cancel anytime with no penalties. We're confident you'll love the results, which is why we don't lock you into lengthy commitments."
      }
    ]
  },
  {
    title: "Security & Reliability",
    icon: Shield,
    questions: [
      {
        q: "Is my data secure?",
        a: "Absolutely! We use bank-level encryption (256-bit SSL), maintain SOC 2 Type II compliance, follow GDPR and CCPA regulations, store data in secure cloud servers, and never share your information. All calls and data are encrypted both in transit and at rest."
      },
      {
        q: "What about HIPAA compliance for healthcare businesses?",
        a: "Yes, we offer HIPAA-compliant solutions for healthcare providers. Our secure infrastructure includes Business Associate Agreements (BAA), encrypted communication, audit logs, and strict access controls to protect patient information."
      },
      {
        q: "What's the uptime guarantee?",
        a: "We guarantee 99.9% uptime with redundant systems across multiple data centers. In the rare event of an issue, failover systems activate automatically to ensure continuous service. We've maintained 99.98% actual uptime over the past year."
      },
      {
        q: "Are call recordings stored? For how long?",
        a: "Yes, all calls are recorded and transcribed for quality assurance and compliance. Recordings are stored securely for 90 days by default (configurable up to 7 years). You have full access to all recordings and transcripts through your dashboard."
      },
      {
        q: "What happens if there's a system outage?",
        a: "Our multi-region infrastructure ensures virtually no downtime. If a rare outage occurs, calls automatically failover to backup systems, or we can route to your team directly. We also provide SMS/email alerts and real-time status updates."
      }
    ]
  },
  {
    title: "Getting Started",
    icon: Calendar,
    questions: [
      {
        q: "How long does setup take?",
        a: "Initial setup takes just 10-15 minutes! You provide basic business information, and we configure your AI agent. Most businesses are live within 24 hours. For complex integrations or custom requirements, setup may take 2-3 business days."
      },
      {
        q: "Do I need technical knowledge to set it up?",
        a: "Not at all! Our setup wizard guides you through every step. No coding required. If you can fill out a form and copy a phone number, you can set up your AI agent. Our support team is also available to help with any questions."
      },
      {
        q: "Can I try it before committing?",
        a: "Yes! We offer a 14-day free trial with no credit card required. Test the AI agent with real calls, explore all features, and see the results before making any commitment. Most businesses see value within the first few days."
      },
      {
        q: "What kind of support do you provide?",
        a: "We provide 24/7 technical support via phone, email, and live chat. Every plan includes onboarding assistance, regular check-ins, optimization recommendations, and access to our knowledge base and video tutorials. For enterprise clients, we offer dedicated account managers."
      },
      {
        q: "Can the AI agent be customized for my industry?",
        a: "Absolutely! We have pre-built templates for 30+ industries including healthcare, legal, real estate, automotive, home services, e-commerce, restaurants, salons, and more. Each template includes industry-specific scripts, compliance measures, and best practices."
      }
    ]
  }
];

const FAQ = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqCategories.flatMap(category => 
      category.questions.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    )
  };

  return (
    <>
      <Helmet>
        <title>FAQ - AI Voice Receptionist Questions Answered | AI Agents 3000</title>
        <meta name="description" content="Get answers about AI voice receptionists: capabilities, pricing, integrations, security, setup time. Learn how AI agents work 24/7 to capture every call." />
        <link rel="canonical" href="https://aiagents3000.com/faq" />
        <meta property="og:title" content="FAQ - AI Voice Receptionist Questions Answered" />
        <meta property="og:description" content="Everything you need to know about AI voice receptionists, pricing, integrations, and how they transform business communication." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiagents3000.com/faq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ - AI Voice Receptionist Questions Answered" />
        <meta name="twitter:description" content="Get answers about AI voice receptionists: capabilities, pricing, integrations, security, and setup." />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <SkipToContent />
        <Navigation />
      
        <main id="main-content">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to know about AI voice agents, integrations, and how they can transform your business
            </p>
            <a 
              href="tel:6612634388"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Phone className="w-5 h-5" />
              Call Us: 661-263-4388
            </a>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-16">
            {faqCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <div key={categoryIndex} className="space-y-6">
                  <div className="flex items-center gap-3 mb-8">
                    <Icon className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold">{category.title}</h2>
                  </div>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((item, itemIndex) => (
                      <AccordionItem 
                        key={itemIndex} 
                        value={`item-${categoryIndex}-${itemIndex}`}
                        className="border border-border rounded-lg px-6 bg-card"
                      >
                        <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl opacity-90 mb-6">
              Talk to our team to learn how AI voice agents can work for your specific business needs
            </p>
            
            {/* Phone Number */}
            <a 
              href="tel:6612634388"
              className="inline-flex items-center gap-2 text-2xl font-bold mb-8 hover:opacity-80 transition-opacity"
            >
              <Phone className="w-6 h-6" />
              661-263-4388
            </a>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a 
                href="/schedule-consultation"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started
              </a>
              <a 
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Calculate Your ROI
              </a>
            </div>
          </div>
        </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default FAQ;
