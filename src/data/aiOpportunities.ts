import { LucideIcon, Phone, Calendar, MessageSquare, Clock, DollarSign, Users, FileText, Shield } from "lucide-react";

export interface AIOpportunity {
  icon: LucideIcon;
  title: string;
  description: string;
  impact: string;
  roi: number;
}

export const aiOpportunitiesByIndustry: Record<string, AIOpportunity[]> = {
  restaurants: [
    {
      icon: Phone,
      title: "Missed Order Recovery",
      description: "AI receptionist captures takeout and delivery orders when your staff is busy, recovering revenue from missed calls during peak hours.",
      impact: "Recover 15-25% of missed calls",
      roi: 5940
    },
    {
      icon: Calendar,
      title: "Catering Booking Automation",
      description: "Automatically handle catering inquiries, collect event details, and book consultations while you focus on food preparation.",
      impact: "Capture $200-500 per booking",
      roi: 2400
    },
    {
      icon: MessageSquare,
      title: "Reservation Management",
      description: "24/7 reservation handling with automatic confirmation, modification, and reminder system to reduce no-shows.",
      impact: "20% reduction in no-shows",
      roi: 1800
    },
    {
      icon: Clock,
      title: "Wait Time Updates",
      description: "Proactively inform customers about current wait times and table availability, improving customer experience.",
      impact: "Improved satisfaction scores",
      roi: 600
    },
    {
      icon: Users,
      title: "Delivery Coordination",
      description: "Streamline delivery service coordination with drivers and customers, providing real-time status updates.",
      impact: "Faster delivery operations",
      roi: 1200
    }
  ],
  medical: [
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "AI handles patient scheduling 24/7, reduces wait times on hold, and integrates with your practice management software.",
      impact: "Handle 100+ calls per day",
      roi: 8400
    },
    {
      icon: FileText,
      title: "Prescription Refill Management",
      description: "Automatically process routine refill requests and forward complex cases to staff, saving hours daily.",
      impact: "Save 2-3 hours daily",
      roi: 3600
    },
    {
      icon: Shield,
      title: "Insurance Verification",
      description: "Collect and verify insurance information before appointments, reducing administrative burden and claim denials.",
      impact: "Reduce claim denials by 30%",
      roi: 4200
    },
    {
      icon: Phone,
      title: "After-Hours Triage",
      description: "Screen after-hours calls, handle routine inquiries, and alert on-call staff only for true emergencies.",
      impact: "Filter 70% of after-hours calls",
      roi: 2400
    },
    {
      icon: MessageSquare,
      title: "Patient Reminders",
      description: "Automated appointment confirmations and reminders reduce no-shows and keep your schedule full.",
      impact: "30% reduction in no-shows",
      roi: 5400
    }
  ],
  contractors: [
    {
      icon: Phone,
      title: "Lead Qualification",
      description: "AI screens incoming calls, qualifies leads based on your criteria, and schedules estimates only with serious prospects.",
      impact: "Save 10+ hours per week",
      roi: 6000
    },
    {
      icon: Calendar,
      title: "Estimate Scheduling",
      description: "Automatically book estimate appointments, collect job details, and sync with your calendar system.",
      impact: "Never miss an estimate request",
      roi: 4800
    },
    {
      icon: MessageSquare,
      title: "Project Status Updates",
      description: "Provide clients with automated project updates, reducing 'Where are you?' calls and improving satisfaction.",
      impact: "50% reduction in status calls",
      roi: 1200
    },
    {
      icon: FileText,
      title: "Material Ordering Coordination",
      description: "Streamline material ordering and delivery coordination with suppliers and job sites.",
      impact: "Improved project timelines",
      roi: 2400
    },
    {
      icon: Clock,
      title: "Emergency Dispatch",
      description: "24/7 emergency call handling routes urgent jobs to on-call crews while filtering non-emergencies.",
      impact: "Capture emergency revenue",
      roi: 3600
    }
  ],
  professional: [
    {
      icon: Calendar,
      title: "Consultation Booking",
      description: "AI schedules consultations, collects client information, and sends confirmation emails automatically.",
      impact: "Book 30% more consultations",
      roi: 7200
    },
    {
      icon: Users,
      title: "Client Screening",
      description: "Pre-qualify potential clients based on your service criteria, saving time on unsuitable prospects.",
      impact: "Focus on qualified leads",
      roi: 4800
    },
    {
      icon: FileText,
      title: "Document Collection",
      description: "Automated document request and collection system for client onboarding and case preparation.",
      impact: "Faster client onboarding",
      roi: 2400
    },
    {
      icon: DollarSign,
      title: "Billing Inquiries",
      description: "Handle routine billing questions and payment arrangement requests without staff intervention.",
      impact: "Reduce billing call volume",
      roi: 1800
    },
    {
      icon: MessageSquare,
      title: "Meeting Coordination",
      description: "Schedule and coordinate multi-party meetings with automatic calendar integration and reminders.",
      impact: "Save 5+ hours weekly",
      roi: 3000
    }
  ],
  "real-estate": [
    {
      icon: Calendar,
      title: "Property Showing Scheduling",
      description: "AI books property showings 24/7, qualifies prospects, and syncs with your showing schedule automatically.",
      impact: "Book 40% more showings",
      roi: 9600
    },
    {
      icon: Users,
      title: "Buyer Qualification",
      description: "Pre-screen buyers for budget, timeline, and preferences before scheduling your time.",
      impact: "Focus on serious buyers",
      roi: 6000
    },
    {
      icon: MessageSquare,
      title: "Listing Inquiries",
      description: "Answer common questions about listings, provide details, and capture lead information automatically.",
      impact: "Never miss a hot lead",
      roi: 4800
    },
    {
      icon: Phone,
      title: "Open House RSVP",
      description: "Manage open house RSVPs, send reminders, and collect visitor information for follow-up.",
      impact: "Higher attendance rates",
      roi: 2400
    },
    {
      icon: FileText,
      title: "Document Signing Coordination",
      description: "Coordinate document signing appointments and track completion status for smooth transactions.",
      impact: "Faster closings",
      roi: 1800
    }
  ],
  legal: [
    {
      icon: Phone,
      title: "Case Screening",
      description: "AI conducts initial case screening, collects relevant information, and routes qualified leads to appropriate attorneys.",
      impact: "Screen 50+ calls daily",
      roi: 12000
    },
    {
      icon: Calendar,
      title: "Consultation Booking",
      description: "Schedule initial consultations 24/7, collect conflict check information, and send confirmation details.",
      impact: "Never miss potential clients",
      roi: 8400
    },
    {
      icon: FileText,
      title: "Document Intake",
      description: "Guide clients through document submission process and ensure complete information before meetings.",
      impact: "Complete case files faster",
      roi: 3600
    },
    {
      icon: MessageSquare,
      title: "Court Date Reminders",
      description: "Automated client reminders for court appearances, deadlines, and document submissions.",
      impact: "Reduce missed appearances",
      roi: 2400
    },
    {
      icon: DollarSign,
      title: "Billing Questions",
      description: "Handle routine billing inquiries and payment arrangement requests professionally and efficiently.",
      impact: "Reduce admin burden",
      roi: 1800
    }
  ],
  salons: [
    {
      icon: Calendar,
      title: "Appointment Booking",
      description: "24/7 online booking with real-time availability, automatic confirmations, and stylist preferences.",
      impact: "Fill 90%+ of time slots",
      roi: 7200
    },
    {
      icon: MessageSquare,
      title: "Service Inquiries",
      description: "Answer questions about services, pricing, and availability while capturing contact information for follow-up.",
      impact: "Convert more inquiries",
      roi: 3600
    },
    {
      icon: Phone,
      title: "Cancellation Management",
      description: "Handle cancellations professionally, offer rebooking, and fill cancelled slots from waitlist automatically.",
      impact: "Reduce lost revenue",
      roi: 4800
    },
    {
      icon: DollarSign,
      title: "Product Orders",
      description: "Take product orders over the phone and coordinate pickup or delivery for retail sales.",
      impact: "Boost retail revenue",
      roi: 2400
    },
    {
      icon: Users,
      title: "Membership Renewals",
      description: "Proactively reach out for membership renewals and special package promotions.",
      impact: "Increase retention",
      roi: 3600
    }
  ],
  plumbers: [
    {
      icon: Phone,
      title: "Emergency Call Capture",
      description: "24/7 emergency call handling routes urgent plumbing jobs to on-call crews instantly while filtering non-emergencies.",
      impact: "Never miss an emergency job",
      roi: 8400
    },
    {
      icon: Users,
      title: "Lead Qualification",
      description: "AI screens incoming calls, qualifies leads based on job type, location, and urgency - filtering serious prospects from tire kickers.",
      impact: "Save 10+ hours per week",
      roi: 6000
    },
    {
      icon: Calendar,
      title: "Estimate Scheduling",
      description: "Automatically book service appointments, collect job details like issue type and location, and sync with your calendar.",
      impact: "Never miss an estimate request",
      roi: 4800
    },
    {
      icon: MessageSquare,
      title: "Follow-up Automation",
      description: "Automated follow-ups on quotes and estimates to convert more prospects into booked jobs.",
      impact: "30% higher quote conversion",
      roi: 3600
    },
    {
      icon: FileText,
      title: "Review Collection",
      description: "Post-job satisfaction calls and automated review requests to build your online reputation.",
      impact: "More 5-star reviews",
      roi: 2400
    }
  ],
  automotive: [
    {
      icon: Calendar,
      title: "Service Scheduling",
      description: "AI books service appointments, collects vehicle information, and provides estimated timing automatically.",
      impact: "Fill service bays efficiently",
      roi: 8400
    },
    {
      icon: MessageSquare,
      title: "Repair Status Updates",
      description: "Provide customers with real-time repair status updates, reducing 'Is it ready?' calls by 80%.",
      impact: "Improved customer satisfaction",
      roi: 1200
    },
    {
      icon: FileText,
      title: "Parts Ordering",
      description: "Streamline parts ordering process and provide customers with accurate availability and pricing.",
      impact: "Faster parts fulfillment",
      roi: 2400
    },
    {
      icon: Shield,
      title: "Warranty Claims",
      description: "Guide customers through warranty claim process and collect required documentation efficiently.",
      impact: "Smoother claims process",
      roi: 1800
    },
    {
      icon: Phone,
      title: "Recall Notifications",
      description: "Proactively notify customers of recalls and schedule service appointments for affected vehicles.",
      impact: "Higher recall compliance",
      roi: 3600
    }
  ]
};

export const getOpportunitiesForIndustry = (industry: string): AIOpportunity[] => {
  return aiOpportunitiesByIndustry[industry] || aiOpportunitiesByIndustry.restaurants;
};
