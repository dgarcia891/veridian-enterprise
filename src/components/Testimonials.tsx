
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      company: "TechFlow",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b5-9?w=400&h=400&fit=crop&crop=face",
      content: "Lumina has completely transformed how we approach digital design. The intuitive interface and powerful features make complex tasks feel effortless."
    },
    {
      name: "Marcus Rodriguez",
      role: "Engineering Lead",
      company: "InnovateLab",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      content: "The performance improvements we've seen since implementing Lumina are remarkable. Our team productivity has increased by 40%."
    },
    {
      name: "Emily Watson",
      role: "Creative Director",
      company: "PixelStudio",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      content: "The collaboration features are game-changing. Our distributed team now works together seamlessly, regardless of location."
    }
  ];

  return (
    <section id="testimonials" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            What Our <span className="font-semibold">Users Say</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their workflow with Lumina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 group"
            >
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              
              <p className="text-white/80 leading-relaxed mb-8 group-hover:text-white transition-colors duration-300">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-white/60 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
