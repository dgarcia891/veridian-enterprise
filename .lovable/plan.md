

## Plan: Blog Post Image Preview & AI Regeneration

### What changes

**1. New Edge Function: `supabase/functions/generate-blog-image/index.ts`**
- Accepts `{ title, excerpt, category }` in the request body
- Calls Lovable AI Gateway with `google/gemini-2.5-flash-image` model to generate a blog featured image based on the post's title/excerpt
- Returns the base64 image data
- Uploads the image to the existing `blog-images` storage bucket using the service role client
- Returns the public URL of the uploaded image

**2. Update `supabase/config.toml`** — add `[functions.generate-blog-image]` with `verify_jwt = false`

**3. Update `src/pages/admin/BlogPostForm.tsx`**
- Replace the plain "Featured Image URL" input (lines 308-318) with an enhanced section:
  - Show the current image as a preview thumbnail if `image_url` is set
  - Keep the URL input field for manual entry
  - Add a "Generate with AI" button that calls the new edge function with the post's title/excerpt/category
  - Show a loading spinner during generation
  - On success, set the returned public URL into `formData.image_url`

### Technical flow

```text
[Admin clicks "Generate with AI"]
       │
       ▼
supabase.functions.invoke("generate-blog-image", {
  body: { title, excerpt, category }
})
       │
       ▼
Edge Function → Lovable AI Gateway (gemini-2.5-flash-image)
       │
       ▼
Base64 image → Upload to blog-images bucket
       │
       ▼
Return public URL → Set as image_url in form
```

