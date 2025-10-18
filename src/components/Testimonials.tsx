
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechFlow",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5-9?w=400&h=400&fit=crop&crop=face",
      content: "VEridian transformed our social media presence completely. Our engagement rates increased by 400% and we saw a direct impact on sales within the first month."
    },
    {
      name: "Marcus Rodriguez",
      role: "CEO",
      company: "InnovateLab",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      content: "The strategic approach VEridian brought to our social campaigns was game-changing. Their data-driven insights helped us reach our target audience more effectively."
    },
    {
      name: "Emily Watson",
      role: "Brand Manager",
      company: "PixelStudio",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      content: "Working with VEridian has been incredible. They don't just manage our social media - they've become true partners in our brand's growth story."
    }
  ];

  return (
    <section id="testimonials" className="py-32 px-6" aria-labelledby="testimonials-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-light text-white mb-6">
            Client <span className="font-semibold">Success Stories</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            See how we've helped brands across industries achieve remarkable growth through strategic social media marketing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Client testimonials">
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              className="glass-card rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 group"
              role="listitem"
            >
              <div className="flex mb-6" role="img" aria-label="5 star rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
              
              <blockquote className="text-white/80 leading-relaxed mb-8 group-hover:text-white transition-colors duration-300">
                "{testimonial.content}"
              </blockquote>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={`Portrait of ${testimonial.name}`}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-white/60 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
