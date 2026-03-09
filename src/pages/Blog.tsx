import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import { Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { usePublishedPosts } from "@/hooks/useBlogPosts";

const Blog = () => {
  const { data: posts, isLoading, error } = usePublishedPosts();

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
        <SkipToContent />
        <Navigation />
      
        <main id="main-content" className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
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

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <p className="text-destructive">Failed to load blog posts. Please try again later.</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && posts?.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
              </div>
            )}

            {/* Featured Post */}
            {posts && posts.length > 0 && (
              <>
                <div className="mb-16">
                  <Link 
                    to={`/blog/${posts[0].slug}`}
                    className="group glass-card rounded-3xl overflow-hidden block hover:shadow-lg transition-all duration-300"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative h-64 md:h-full overflow-hidden">
                        <img 
                          src={posts[0].image_url || "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop"} 
                          alt={posts[0].title}
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
                            {posts[0].category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {posts[0].published_at 
                              ? new Date(posts[0].published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : 'Recently'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {posts[0].read_time}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                          {posts[0].title}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          {posts[0].excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all">
                          Read Article <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Blog Grid */}
                {posts.length > 1 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.slice(1).map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={post.image_url || "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop"} 
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
                              {post.published_at 
                                ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : 'Recently'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {post.read_time}
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
                )}
              </>
            )}

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
