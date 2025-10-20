export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  quote: string;
  rating: number;
}

// Placeholder testimonials - to be replaced with real customer testimonials
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Coming Soon",
    role: "Business Owner",
    company: "Your Company",
    quote: "Testimonials will be added as we collect customer feedback.",
    rating: 5
  }
];
