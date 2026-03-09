

## Performance Optimization Plan

### Current State
- **Route splitting**: Already good — all pages use `lazy()` + `Suspense`.
- **Images**: No `loading="lazy"` on any public-facing images (Blog, BlogPost, SMSOptInGuide). Only admin MediaLibrary uses it.
- **Recharts**: Imported eagerly in 4 homepage components (ProblemStatsSection, InteractiveCalculator, GrowthSection, EnhancedCalculator). Recharts is a large library (~200KB) loaded on every homepage visit.
- **RetellChatInterface**: Loaded eagerly on every non-demo page, including its SDK dependency.
- **Suspense fallback**: Plain text "Loading..." with no spinner or skeleton.

### Changes

#### 1. Add `loading="lazy"` to all public-facing images
Files: `Blog.tsx`, `BlogPost.tsx`, `SMSOptInGuide.tsx`, `BlogPostForm.tsx`
- Add `loading="lazy"` attribute to all `<img>` tags. This defers offscreen image loading.

#### 2. Lazy-load recharts components on the homepage
Wrap the chart-heavy homepage sections in dynamic imports so recharts isn't in the critical path:
- In `Index.tsx`, convert `InteractiveCalculator`, `ProblemStatsSection`, `GrowthSection`, and `CaseStudySection` to `lazy()` imports with individual `Suspense` boundaries using skeleton placeholders.

#### 3. Lazy-load RetellChatInterface
In `App.tsx`, convert the chat widget to a lazy import so the Retell SDK isn't bundled in the initial load. Wrap in its own `Suspense` with `null` fallback (invisible until loaded).

#### 4. Improve Suspense fallback with a spinner
Replace the plain "Loading..." text in App.tsx with a proper loading spinner using the existing Lucide `Loader2` icon and animation.

#### 5. Add font `display=swap` 
In `index.html`, add `&display=swap` to the Google Fonts URL to prevent render-blocking on font load.

### Impact
- **Initial bundle**: Removes recharts (~200KB) and Retell SDK from critical path
- **LCP**: Faster with font swap and deferred offscreen images
- **FID/INP**: Less JS to parse on initial load

