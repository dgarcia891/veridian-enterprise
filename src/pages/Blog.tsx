import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const blogPosts = [
  {
    id: 1,
    title: "How AI Voice Assistants Are Transforming Customer Service",
    excerpt: "Discover how businesses are using AI voice technology to provide 24/7 customer support and never miss a call again.",
    date: "2024-03-15",
    readTime: "5 min read",
    category: "AI Technology",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop",
    slug: "transforming-customer-service",
  },
  {
    id: 2,
    title: "The ROI of Implementing Voice AI in Your Business",
    excerpt: "Learn how local businesses are seeing returns on investment within the first month of deploying AI receptionists.",
    date: "2024-03-10",
    readTime: "7 min read",
    category: "Business Growth",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    slug: "roi-of-voice-ai",
  },
  {
    id: 3,
    title: "5 Signs Your Business Needs an AI Receptionist",
    excerpt: "Missing calls? High receptionist turnover? Here are the telltale signs it's time to automate your phone system.",
    date: "2024-03-05",
    readTime: "4 min read",
    category: "Best Practices",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop",
    slug: "signs-you-need-ai",
  },
  {
    id: 4,
    title: "Setting Up Your First AI Voice Agent: A Complete Guide",
    excerpt: "Step-by-step instructions for getting your AI receptionist up and running in under 10 minutes.",
    date: "2024-02-28",
    readTime: "8 min read",
    category: "Tutorial",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop",
    slug: "setting-up-first-ai",
  },
  {
    id: 5,
    title: "Why Local Businesses Are Switching to AI Receptionists",
    excerpt: "From restaurants to car dealerships, see why small businesses are embracing voice AI technology.",
    date: "2024-02-20",
    readTime: "6 min read",
    category: "Case Studies",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop",
    slug: "why-local-businesses-switching",
  },
  {
    id: 6,
    title: "The Future of Business Communication: AI and Beyond",
    excerpt: "Exploring emerging trends in AI-powered communication and what they mean for your business.",
    date: "2024-02-15",
    readTime: "5 min read",
    category: "Industry Insights",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
    slug: "future-of-communication",
  },
];

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>AI Voice Technology Blog - Insights & Best Practices | AI Agents 3000</title>
        <meta name="description" content="Expert insights on AI voice assistants, ROI calculations, and success stories. Learn how AI receptionists transform customer service for local businesses." />
        <link rel="canonical" href="https://veridian.lovable.app/blog" />
        <meta property="og:title" content="AI Voice Technology Blog - Insights & Best Practices" />
        <meta property="og:description" content="Expert insights on AI voice assistants, ROI calculations, and success stories from local businesses." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://veridian.lovable.app/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Voice Technology Blog - Insights & Best Practices" />
        <meta name="twitter:description" content="Expert insights on AI voice assistants, ROI calculations, and success stories from local businesses." />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              AI Insights & Updates
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Stay informed with the latest trends, tips, and insights on AI voice technology and how it's transforming businesses.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <Link 
              to={`/blog/${blogPosts[0].slug}`}
              className="group glass-card rounded-3xl overflow-hidden block hover:shadow-lg transition-all duration-300"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-64 md:h-full overflow-hidden">
                  <img 
                    src={blogPosts[0].image} 
                    alt={blogPosts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                      {blogPosts[0].category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(blogPosts[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {blogPosts[0].readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all">
                    Read Article <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    Read More <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 glass-card p-8 sm:p-12 rounded-3xl border border-primary/50 text-center bg-gradient-to-br from-primary/5 to-primary/10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Don't miss another customer call. Get started with our AI Voice Receptionist today and see results in your first week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/schedule-consultation"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
              >
                Schedule Free Demo
              </Link>
              <Link
                to="/lost-revenue-calculator"
                className="inline-flex items-center justify-center glass-button px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
              >
                Calculate Lost Revenue
              </Link>
            </div>
          </div>
        </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
