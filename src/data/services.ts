import { LucideIcon, Clock, Phone, Zap, Target, CheckCircle, DollarSign, Globe, Shield, MessageCircle, Brain, Sparkles, BarChart3, Languages, BookOpen } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Benefit {
  stat: string;
  description: string;
  icon: LucideIcon;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroSubtitle: string;
  features: Feature[];
  benefits: Benefit[];
  pricing: PricingPlan[];
  active: boolean;
  href?: string;
}

export const services: Service[] = [
  {
    id: "voice-ai-receptionist",
    slug: "voice-ai-receptionist",
    name: "Voice AI Receptionist",
    tagline: "Never Miss a Call Again",
    description: "Meet your 24/7 Voice AI Receptionist — natural, reliable, multilingual. Handles scheduling, FAQs, and lead capture so you don't have to.",
    heroSubtitle: "Our AI receptionist answers every call instantly, qualifies leads, takes complex orders, and books appointments directly into your calendar. Setup takes 10 minutes, not months.",
    features: [
      {
        icon: Clock,
        title: "24/7 Availability",
        description: "Your AI receptionist never sleeps, takes breaks, or calls in sick. Every call is answered instantly, day or night."
      },
      {
        icon: Phone,
        title: "Complex Order Handling",
        description: "Takes detailed orders with specific instructions, dietary restrictions, and customizations—just like your best employee."
      },
      {
        icon: Zap,
        title: "Instant Lead Qualification",
        description: "Asks budget, timeline, and scope questions to qualify leads before they reach you, saving hours of wasted calls."
      },
      {
        icon: Globe,
        title: "Multi-Lingual Support",
        description: "Communicates fluently in English, Spanish, French, German, Hindi, Russian, Portuguese, Japanese, Italian, and Dutch to serve your diverse customer base."
      },
      {
        icon: Target,
        title: "Appointment Booking",
        description: "Schedules directly into your calendar with real-time availability, sends confirmations, and handles rescheduling."
      },
      {
        icon: CheckCircle,
        title: "Real-time Updates",
        description: "Provides accurate wait times, service availability, and business hours—always up to date with your operations."
      },
      {
        icon: DollarSign,
        title: "Seamless Integration",
        description: "Connects with your existing POS, CRM, and calendar systems via API. Works with your current tools."
      },
      {
        icon: Shield,
        title: "HIPAA Compliance Available",
        description: "Medical/Healthcare plan includes HIPAA-compliant infrastructure with no PII storage, BAA agreements, and enhanced security protocols for protected health information."
      }
    ],
    benefits: [
      {
        stat: "100%",
        description: "of calls answered, even at peak hours",
        icon: Phone
      },
      {
        stat: "24/7",
        description: "availability without additional staffing costs",
        icon: Clock
      },
      {
        stat: "10 min",
        description: "setup time to launch your AI receptionist",
        icon: Zap
      }
    ],
    pricing: [
      {
        name: "AI Agent",
        price: "$600",
        period: "/month",
        description: "Core AI Voice & Chat Agent - Integrations Extra",
        features: [
          "AI Voice Receptionist (24/7)",
          "Unlimited call handling",
          "Natural conversation AI",
          "Multi-language support",
          "Lead qualification",
          "Appointment booking",
          "Email notifications",
          "Basic analytics",
          "CRM integrations available for additional cost",
          "Advanced features available for additional cost"
        ],
        popular: true,
        ctaText: "Get Started"
      }
    ],
    active: true,
    href: "/ai-receptionist"
  },
  {
    id: "ai-chat-widget",
    slug: "ai-chat-widget",
    name: "AI Chat Widget",
    tagline: "24/7 Intelligent Customer Engagement",
    description: "Transform your website into a conversion machine with our intelligent AI chat widget. Multi-lingual, expertly trained, and always ready to help your visitors.",
    heroSubtitle: "Deploy a sophisticated AI chat assistant on your website in minutes. Trained on your business knowledge, fluent in multiple languages, and capable of handling complex customer inquiries with natural, human-like conversations.",
    features: [
      {
        icon: Languages,
        title: "Multi-Lingual Excellence",
        description: "Communicate fluently in 95+ languages with automatic detection and seamless language switching. Serve global customers without language barriers."
      },
      {
        icon: Brain,
        title: "Easy Training & Customization",
        description: "Simply upload your documents, FAQs, and product information. Our AI learns your business in minutes and stays updated as you grow."
      },
      {
        icon: Sparkles,
        title: "Expert Knowledge Base",
        description: "Trained on your specific industry expertise, product catalogs, and company policies. Provides accurate, contextual answers every time."
      },
      {
        icon: MessageCircle,
        title: "Natural Conversations",
        description: "Advanced AI understands context, intent, and nuance. Handles complex questions with human-like responses that feel personal and authentic."
      },
      {
        icon: Target,
        title: "Smart Lead Capture",
        description: "Intelligently qualifies leads during conversations, collects contact information naturally, and routes hot prospects to your sales team."
      },
      {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Track conversation metrics, customer sentiment, common questions, and conversion rates. Gain insights to improve your business."
      },
      {
        icon: Zap,
        title: "Instant Integration",
        description: "One-line code snippet installs on any website. Works with Shopify, WordPress, Wix, custom sites, and all major platforms."
      },
      {
        icon: BookOpen,
        title: "Continuous Learning",
        description: "Improves over time by learning from conversations. You can refine responses, add new information, and optimize performance."
      }
    ],
    benefits: [
      {
        stat: "3X",
        description: "increase in customer engagement and conversions",
        icon: Target
      },
      {
        stat: "95+",
        description: "languages supported out of the box",
        icon: Globe
      },
      {
        stat: "60%",
        description: "reduction in support ticket volume",
        icon: MessageCircle
      }
    ],
    pricing: [
      {
        name: "AI Chat Widget",
        price: "$150",
        period: "/month",
        description: "Add-on to AI Agent - Includes Website Chat",
        features: [
          "Requires AI Agent ($600/month)",
          "Website chat widget",
          "Up to 2,500 conversations/month",
          "All 95+ languages included",
          "Advanced customization",
          "CRM integrations",
          "Custom training documents",
          "Analytics & reports"
        ],
        popular: true,
        ctaText: "Add Chat Widget"
      }
    ],
    active: true
  }
];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(service => service.slug === slug && service.active);
};

export const getActiveServices = (): Service[] => {
  return services.filter(service => service.active);
};
