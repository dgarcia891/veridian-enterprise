import { testimonials } from "@/data/testimonials";
import { Star } from "lucide-react";

interface SocialProofProps {
  title?: string;
  subtitle?: string;
}

const SocialProof = ({ 
  title = "Built for Real Businesses",
  subtitle = "Join growing companies capturing every revenue opportunity"
}: SocialProofProps) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="glass-card p-8 rounded-2xl animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} star rating`}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" aria-hidden="true" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-4">
                {testimonial.image && (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length > 0 && testimonials[0].id !== "1" && (
          <div className="text-center mt-12">
            <p className="text-2xl font-semibold text-muted-foreground">
              Start capturing every call with Voice AI
            </p>
          </div>
        )}
        
        {testimonials.length === 1 && testimonials[0].id === "1" && (
          <div className="text-center mt-8">
            <div className="glass-card p-12 rounded-3xl max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Real Customer Testimonials Coming Soon</h3>
              <p className="text-lg text-muted-foreground mb-6">
                We're launching our Voice AI Receptionist service and will be adding real customer success stories as they roll in.
              </p>
              <p className="text-muted-foreground">
                Want to be one of our first customers? Get started today and help shape the future of AI phone answering.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SocialProof;
