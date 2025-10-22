import { LucideIcon, Clock, Phone, Zap, Target, CheckCircle, DollarSign, Globe } from "lucide-react";

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
        icon: Globe,
        title: "Multi-Lingual Support",
        description: "Communicates fluently in English, Spanish, French, German, Hindi, Russian, Portuguese, Japanese, Italian, and Dutch to serve your diverse customer base."
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
        name: "Monthly",
        price: "$600*",
        period: "/month",
        description: "Perfect for trying out the service with no long-term commitment",
        features: [
          "Unlimited call handling",
          "24/7 availability",
          "Lead qualification",
          "Appointment booking",
          "Calendar integration",
          "Email support"
        ],
        ctaText: "Start Monthly"
      },
      {
        name: "Annual",
        price: "$300*",
        period: "/month",
        description: "Save $3,600/year with annual billing - our most popular plan",
        features: [
          "Everything in Monthly, plus:",
          "50% off (billed $3,600/year)",
          "Priority support",
          "Advanced customization",
          "Dedicated account manager",
          "Custom integrations",
          "Quarterly strategy calls"
        ],
        popular: true,
        ctaText: "Start Annual"
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
