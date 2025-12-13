import { LucideIcon, Utensils, Stethoscope, Wrench, Briefcase, Home, Scale, Scissors, Car, Droplets } from "lucide-react";

export interface Industry {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export const industries: Industry[] = [
  {
    id: "restaurants",
    name: "Restaurants",
    icon: Utensils,
    description: "Handle takeout orders and reservations"
  },
  {
    id: "medical",
    name: "Medical Offices",
    icon: Stethoscope,
    description: "Schedule appointments and answer patient inquiries"
  },
  {
    id: "contractors",
    name: "Contractors",
    icon: Wrench,
    description: "Qualify leads and book estimate calls"
  },
  {
    id: "plumbers",
    name: "Plumbing",
    icon: Droplets,
    description: "Capture emergency calls and book service appointments"
  },
  {
    id: "professional",
    name: "Professional Services",
    icon: Briefcase,
    description: "Screen clients and manage consultations"
  },
  {
    id: "real-estate",
    name: "Real Estate",
    icon: Home,
    description: "Schedule property showings and qualify buyers"
  },
  {
    id: "legal",
    name: "Legal Services",
    icon: Scale,
    description: "Screen potential clients and book consultations"
  },
  {
    id: "salons",
    name: "Salons & Spas",
    icon: Scissors,
    description: "Book appointments and answer service questions"
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: Car,
    description: "Schedule service appointments and answer inquiries"
  }
];
