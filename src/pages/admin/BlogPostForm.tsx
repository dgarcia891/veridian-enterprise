import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePostById, useCreatePost, useUpdatePost, BlogPostInsert } from "@/hooks/useBlogPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, Globe, ImageIcon, Sparkles } from "lucide-react";
import { AIBlogAssistantPanel } from "@/components/admin/AIBlogAssistantPanel";

const categories = [
  "AI Technology",
  "Business Growth",
  "Best Practices",
  "Tutorial",
  "Case Studies",
  "Industry Insights",
];

const BlogPostForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "AI Technology",
    read_time: "5 min read",
    image_url: "",
    author_name: "Voice AI Team",
    source_url: "",
    status: "draft" as "draft" | "published",
    seo_title: "",
    meta_description: "",
    seo_keywords: [] as string[],
    faq_schema: [] as any[],
  });

  const { data: existingPost, isLoading: loadingPost } = usePostById(id || "");
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        slug: existingPost.slug,
        excerpt: existingPost.excerpt,
        content: existingPost.content,
        category: existingPost.category,
        read_time: existingPost.read_time,
        image_url: existingPost.image_url || "",
        author_name: existingPost.author_name || "Voice AI Team",
        source_url: existingPost.source_url || "",
        status: existingPost.status as "draft" | "published",
        seo_title: existingPost.seo_title || "",
        meta_description: existingPost.meta_description || "",
        seo_keywords: existingPost.seo_keywords || [],
        faq_schema: (existingPost.faq_schema as any[]) || [],
      });
    }
  }, [existingPost]);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setIsAdmin(false);
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    setIsAdmin(roles && roles.length > 0);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const postData: BlogPostInsert = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      read_time: formData.read_time,
      author_name: formData.author_name,
      status: formData.status,
      image_url: formData.image_url || null,
      source_url: formData.source_url || null,
      published_at: formData.status === "published" ? new Date().toISOString() : null,
      seo_title: formData.seo_title || null,
      meta_description: formData.meta_description || null,
      seo_keywords: formData.seo_keywords.length > 0 ? formData.seo_keywords : null,
      faq_schema: formData.faq_schema.length > 0 ? formData.faq_schema : null,
    };

    try {
      if (isEditing && id) {
        await updatePost.mutateAsync({ id, ...postData });
        toast.success("Post updated successfully");
      } else {
        await createPost.mutateAsync(postData);
        toast.success("Post created successfully");
      }
      navigate("/admin/blog");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save post";
      toast.error(message);
    }
  };

  if (isAdmin === null || (isEditing && loadingPost)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You need admin privileges to access this page.</p>
          <Link to="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </Link>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Edit Post" : "New Post"}
            </h1>
          </div>
        </div>

        {/* AI Assistant Panel */}
        {!isEditing && (
          <AIBlogAssistantPanel
            onApply={(data) => {
              setFormData((prev) => ({
                ...prev,
                title: data.title,
                slug: generateSlug(data.title),
                excerpt: data.excerpt,
                content: data.content,
                category: data.suggested_category,
                read_time: data.read_time,
                source_url: data.source_url || "",
                seo_title: data.seo_title,
                meta_description: data.meta_description,
                seo_keywords: data.seo_keywords,
                faq_schema: data.faq_schema,
              }));
            }}
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card rounded-xl p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter post title"
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="url-friendly-slug"
                required
              />
              <p className="text-sm text-muted-foreground">
                URL: /blog/{formData.slug || "your-slug"}
              </p>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description shown on blog list"
                rows={2}
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                placeholder="Start writing your article..."
              />
            </div>

            {/* Category & Read Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="read_time">Read Time</Label>
                <Input
                  id="read_time"
                  value={formData.read_time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, read_time: e.target.value }))}
                  placeholder="5 min read"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-3">
              <Label>Featured Image</Label>
              
              {/* Image Preview */}
              {formData.image_url && (
                <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
                  <img
                    src={formData.image_url}
                    alt="Featured image preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* URL Input + AI Generate */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isGeneratingImage || !formData.title}
                  onClick={async () => {
                    setIsGeneratingImage(true);
                    try {
                      const { data, error } = await supabase.functions.invoke("generate-blog-image", {
                        body: { title: formData.title, excerpt: formData.excerpt, category: formData.category },
                      });
                      if (error) throw error;
                      if (data?.error) throw new Error(data.error);
                      if (data?.url) {
                        setFormData((prev) => ({ ...prev, image_url: data.url }));
                        toast.success("Image generated successfully");
                      }
                    } catch (err: unknown) {
                      const msg = err instanceof Error ? err.message : "Failed to generate image";
                      toast.error(msg);
                    } finally {
                      setIsGeneratingImage(false);
                    }
                  }}
                >
                  {isGeneratingImage ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {isGeneratingImage ? "Generating..." : "AI Generate"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Paste a URL or generate an image with AI based on the post title & excerpt
              </p>
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author_name">Author Name</Label>
              <Input
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, author_name: e.target.value }))}
                placeholder="Voice AI Team"
              />
            </div>

            {/* Source URL */}
            <div className="space-y-2">
              <Label htmlFor="source_url">Source Article URL</Label>
              <Input
                id="source_url"
                type="url"
                value={formData.source_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, source_url: e.target.value }))}
                placeholder="https://example.com/original-article"
              />
              <p className="text-sm text-muted-foreground">
                Link to the original source article (optional)
              </p>
            </div>

            {/* Publish Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Publish Status</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.status === "published" ? "Post is visible to everyone" : "Post is saved as draft"}
                </p>
              </div>
              <Switch
                checked={formData.status === "published"}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, status: checked ? "published" : "draft" }))
                }
              />
            </div>
          </div>

          {/* SEO & Metadata */}
          <div className="glass-card rounded-xl p-6 space-y-6 mt-8">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">SEO & Metadata</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seo_title">SEO Title</Label>
                <Input
                  id="seo_title"
                  value={formData.seo_title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, seo_title: e.target.value }))}
                  placeholder="Optimized title for search engines"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">Recommended: 50-60 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Compelling description for search results"
                  rows={2}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">Recommended: 150-160 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo_keywords">Keywords (comma separated)</Label>
                <Input
                  id="seo_keywords"
                  value={formData.seo_keywords.join(", ")}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    seo_keywords: e.target.value.split(",").map(k => k.trim()).filter(k => k !== "")
                  }))}
                  placeholder="ai, voice agent, automation"
                />
              </div>

              {formData.faq_schema.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <Label>Generated FAQ Schema</Label>
                  <div className="space-y-3">
                    {formData.faq_schema.map((item, idx) => (
                      <div key={idx} className="bg-muted/50 p-3 rounded-lg text-sm">
                        <p className="font-bold mb-1">Q: {item.question}</p>
                        <p className="text-muted-foreground">A: {item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/admin/blog">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={createPost.isPending || updatePost.isPending}
            >
              {(createPost.isPending || updatePost.isPending) ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isEditing ? "Save Changes" : "Create Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPostForm;
