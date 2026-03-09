import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, User, Loader2, Pencil } from "lucide-react";
import { usePostBySlug } from "@/hooks/useBlogPosts";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFunnelTracking } from "@/hooks/useFunnelTracking";
import { useEffect } from "react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = usePostBySlug(slug || "");
  const { isAdmin } = useIsAdmin();
  const { trackBlogView, trackCTAClick } = useAnalytics();
  const { trackBlogVisit } = useFunnelTracking();

  useEffect(() => {
    if (post) {
      trackBlogView(post.slug, post.title);
      trackBlogVisit(post.slug, post.title);
    }
  }, [post, trackBlogView, trackBlogVisit]);

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

  // Parse inline markdown (links, bold, italic)
  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIndex = 0;

    while (remaining.length > 0) {
      // Match markdown links [text](url)
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
      // Match bold **text** or __text__
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*|__([^_]+)__/);
      // Match italic *text* or _text_ (but not inside bold)
      const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)|(?<!_)_([^_]+)_(?!_)/);

      // Find the earliest match
      const matches = [
        linkMatch ? { type: 'link', match: linkMatch, index: remaining.indexOf(linkMatch[0]) } : null,
        boldMatch ? { type: 'bold', match: boldMatch, index: remaining.indexOf(boldMatch[0]) } : null,
        italicMatch ? { type: 'italic', match: italicMatch, index: remaining.indexOf(italicMatch[0]) } : null,
      ].filter(Boolean).sort((a, b) => a!.index - b!.index);

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      const earliest = matches[0]!;
      
      // Add text before the match
      if (earliest.index > 0) {
        parts.push(remaining.slice(0, earliest.index));
      }

      // Process the match
      if (earliest.type === 'link') {
        const [fullMatch, linkText, url] = earliest.match;
        parts.push(
          <a 
            key={keyIndex++} 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {linkText}
          </a>
        );
        remaining = remaining.slice(earliest.index + fullMatch.length);
      } else if (earliest.type === 'bold') {
        const [fullMatch, text1, text2] = earliest.match;
        parts.push(<strong key={keyIndex++}>{text1 || text2}</strong>);
        remaining = remaining.slice(earliest.index + fullMatch.length);
      } else if (earliest.type === 'italic') {
        const [fullMatch, text1, text2] = earliest.match;
        parts.push(<em key={keyIndex++}>{text1 || text2}</em>);
        remaining = remaining.slice(earliest.index + fullMatch.length);
      }
    }

    return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
  };

  // Simple markdown to HTML conversion for basic formatting
  const renderContent = (content: string) => {
    return content
      .split("\n\n")
      .map((paragraph, index) => {
        // Handle headers
        if (paragraph.startsWith("## ")) {
          return (
            <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
              {parseInlineMarkdown(paragraph.replace("## ", ""))}
            </h2>
          );
        }
        if (paragraph.startsWith("### ")) {
          return (
            <h3 key={index} className="text-xl font-bold mt-6 mb-3">
              {parseInlineMarkdown(paragraph.replace("### ", ""))}
            </h3>
          );
        }
        // Handle lists
        if (paragraph.includes("\n- ")) {
          const items = paragraph.split("\n- ").filter(Boolean);
          return (
            <ul key={index} className="list-disc list-inside space-y-2 my-4">
              {items.map((item, i) => (
                <li key={i}>{parseInlineMarkdown(item.replace("- ", ""))}</li>
              ))}
            </ul>
          );
        }
        // Regular paragraph
        return (
          <p key={index} className="mb-4 leading-relaxed">
            {parseInlineMarkdown(paragraph)}
          </p>
        );
      });
  };

  return (
    <>
      <Helmet>
        <title>{post.seo_title || `${post.title} | AI Agents 3000 Blog`}</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <link rel="canonical" href={`https://aiagents3000.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.seo_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://aiagents3000.com/blog/${post.slug}`} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta property="article:published_time" content={post.published_at || post.created_at} />
        <meta property="article:author" content={post.author_name || "AI Agents 3000"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seo_title || post.title} />
        <meta name="twitter:description" content={post.meta_description || post.excerpt} />

        {/* Article structured data for AEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.meta_description || post.excerpt,
            "image": post.image_url || "",
            "author": {
              "@type": "Organization",
              "name": post.author_name || "AI Agents 3000",
              "url": "https://aiagents3000.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "AI Agents 3000",
              "url": "https://aiagents3000.com",
              "logo": { "@type": "ImageObject", "url": "https://aiagents3000.com/favicon.png" }
            },
            "datePublished": post.published_at || post.created_at,
            "dateModified": post.updated_at || post.published_at || post.created_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://aiagents3000.com/blog/${post.slug}`
            },
            ...(post.seo_keywords ? { "keywords": post.seo_keywords.join(", ") } : {}),
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["article h1", "article .excerpt", "article p:first-of-type"]
            }
          })}
        </script>

        {/* FAQ Schema */}
        {post.faq_schema && Array.isArray(post.faq_schema) && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": post.faq_schema.map((item: any) => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.answer
                }
              }))
            })}
          </script>
        )}
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
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-foreground">
              {renderContent(post.content)}
            </div>

            {/* AI Generated FAQ Section */}
            {post.faq_schema && Array.isArray(post.faq_schema) && post.faq_schema.length > 0 && (
              <section className="mt-12 pt-12 border-t">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {post.faq_schema.map((item: any, index: number) => (
                    <div key={index} className="bg-muted/30 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

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
