import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, User, Loader2, Pencil } from "lucide-react";
import { usePostBySlug } from "@/hooks/useBlogPosts";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePostBySlug(slug || "");
  const { isAdmin } = useIsAdmin();
  const { trackBlogView, trackCTAClick } = useAnalytics();

  useEffect(() => {
    if (post) {
      trackBlogView(post.slug, post.title);
    }
  }, [post, trackBlogView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/blog" replace />;
  }

  // Simple markdown to HTML conversion for basic formatting
  const renderContent = (content: string) => {
    return content
      .split("\n\n")
      .map((paragraph, index) => {
        // Handle headers
        if (paragraph.startsWith("## ")) {
          return (
            <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
              {paragraph.replace("## ", "")}
            </h2>
          );
        }
        if (paragraph.startsWith("### ")) {
          return (
            <h3 key={index} className="text-xl font-bold mt-6 mb-3">
              {paragraph.replace("### ", "")}
            </h3>
          );
        }
        // Handle lists
        if (paragraph.includes("\n- ")) {
          const items = paragraph.split("\n- ").filter(Boolean);
          return (
            <ul key={index} className="list-disc list-inside space-y-2 my-4">
              {items.map((item, i) => (
                <li key={i}>{item.replace("- ", "")}</li>
              ))}
            </ul>
          );
        }
        // Regular paragraph
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {paragraph}
          </p>
        );
      });
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | AI Agents 3000 Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://veridian.lovable.app/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://veridian.lovable.app/blog/${post.slug}`} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <article className="max-w-4xl mx-auto">
            {/* Back Link & Admin Edit */}
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Blog
              </Link>

              {isAdmin && (
                <Button asChild variant="outline" size="sm">
                  <Link to={`/admin/blog/edit/${post.id}`}>
                    <Pencil size={16} className="mr-2" />
                    Edit Post
                  </Link>
                </Button>
              )}
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                    : "Recently"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {post.read_time}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                {post.title}
              </h1>

              {post.author_name && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User size={16} />
                  <span>By {post.author_name}</span>
                </div>
              )}
            </header>

            {/* Featured Image */}
            {post.image_url && (
              <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-8">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-foreground">
              {renderContent(post.content)}
            </div>

            {/* CTA Section */}
            <div className="mt-16 glass-card p-8 rounded-2xl border border-primary/50 text-center bg-gradient-to-br from-primary/5 to-primary/10">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-6">
                See how AI voice technology can transform your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/schedule-consultation"
                  onClick={() => trackCTAClick("Schedule Demo", "Blog Post Bottom CTA")}
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
                >
                  Schedule Demo
                </Link>
                <Link
                  to="/lost-revenue-calculator"
                  onClick={() => trackCTAClick("Calculate ROI", "Blog Post Bottom CTA")}
                  className="inline-flex items-center justify-center glass-button px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
                >
                  Calculate ROI
                </Link>
              </div>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
