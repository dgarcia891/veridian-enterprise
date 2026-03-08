

# Production vs Preview Audit: Identified Issues

After comparing `aiagents3000.com` (production) against the preview codebase, here are all discrepancies found across pricing, layout, navigation, and content.

---

## Issues Found

### 1. Routing Mismatch: Services Page "Learn More" Links
**Services page** (`/services`) navigates to `/${service.slug}` (e.g., `/voice-ai-receptionist`), but there is **no route** for `/voice-ai-receptionist`. The dedicated page is at `/ai-receptionist`. The AI Chat Widget card navigates to `/ai-chat-widget` which also has no route -- it would hit the 404 page.

**Fix:** Update the Services page to use `service.href` when available (which is `/ai-receptionist` for voice), and for Chat Widget either add an `href` in the services data or route to `/services/ai-chat-widget`.

### 2. Mobile CTA Routes to Non-Existent `/signup`
The mobile navigation CTA button navigates to `/signup`, but there is **no `/signup` route** defined. This is a dead link leading to 404.

**Fix:** Change mobile CTA to navigate to `/schedule-consultation` (matching desktop behavior).

### 3. Combined Package Pricing Inconsistency
The Services page shows the combined package as **$249/month** (Starter $99 + Chat Widget $150). However, the Professional plan is $600/month. The combined pricing is misleading because it implies you get the full Voice AI for $99, but serious businesses would need the $600 Professional tier. The production site has the same issue, so this is a content/strategy decision.

**Fix (optional):** Clarify the combined pricing or show multiple bundle options.

### 4. ServiceDetail Route Uses Wrong Param
Route is `/services/:serviceId` but `ServiceDetail.tsx` reads `useParams<{ slug: string }>()` and calls `getServiceBySlug(slug)`. The param name mismatch means `slug` is always `undefined`, causing the page to redirect to 404.

**Fix:** Change route to `/services/:slug` or update the component to use `serviceId`.

### 5. Missing `ScrollToTop` Component Usage
`ScrollToTop` is imported in `App.tsx` but never rendered in the JSX. Users navigating between pages won't scroll to top.

**Fix:** Add `<ScrollToTop />` inside the `BrowserRouter`.

### 6. Homepage Final CTA Differences
Production homepage ends with "Book My Free AI Audit" CTA linking to the audit page. Need to verify our Index.tsx matches this.

### 7. Footer Missing "Services" Quick Links
Production footer visible in screenshots doesn't have a Services section, but adding one would improve internal linking and SEO.

---

## Implementation Plan

### Step 1: Fix routing issues
- **Services page:** Use `service.href || \`/services/${service.slug}\`` for navigation instead of `/${service.slug}`
- **App.tsx route:** Change `/services/:serviceId` to `/services/:slug`
- Add `href` to AI Chat Widget in `services.ts` data (e.g., `/services/ai-chat-widget`)

### Step 2: Fix mobile CTA dead link
- Change Navigation mobile CTA from `/signup` to `/schedule-consultation`

### Step 3: Add ScrollToTop
- Render `<ScrollToTop />` inside `BrowserRouter` in App.tsx

### Step 4: Verify ServiceDetail param
- Ensure the route param name matches `useParams` usage

---

## Technical Details

Files to modify:
- `src/pages/Services.tsx` -- Fix service card navigation links
- `src/components/Navigation.tsx` -- Fix mobile CTA route
- `src/App.tsx` -- Fix route param name, add ScrollToTop
- `src/data/services.ts` -- Add `href` for AI Chat Widget service

