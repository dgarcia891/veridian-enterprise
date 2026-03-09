

## Newsletter Signup with Lead Magnet Integration

### What We're Building
A reusable newsletter signup component with a lead magnet (free "AI Readiness Checklist" PDF download) that appears on the homepage (before the footer) and on the blog page (between the blog grid and CTA section). Subscribers are stored in a new `newsletter_subscribers` database table.

### Database
Create `newsletter_subscribers` table:
- `id` (uuid, PK), `email` (text, unique, not null), `first_name` (text, nullable), `lead_magnet_sent` (boolean, default false), `source_page` (text), `created_at` (timestamptz)
- RLS: public INSERT (anyone can subscribe), admin-only SELECT/DELETE
- Enable realtime not needed here

### Component: `src/components/NewsletterSignup.tsx`
- Accepts `variant` prop: `"inline"` (for blog page, compact horizontal layout) or `"banner"` (for homepage, full-width section with gradient background)
- Fields: email (required), first name (optional)
- Lead magnet messaging: "Get our free AI Readiness Checklist" with a download icon
- On submit: insert into `newsletter_subscribers`, track analytics event, show success toast with "Check your inbox" message, display a download link for the checklist
- Duplicate email handling: upsert or friendly "already subscribed" message
- Uses existing UI components (Input, Button, Card)

### Lead Magnet PDF
- Generate a simple placeholder PDF download link (can be replaced with a real asset later)
- Store the checklist URL as a constant for easy updates

### Page Integration
- **Index.tsx**: Add `<NewsletterSignup variant="banner" />` between `CloserSection` and the FAQ link section
- **Blog.tsx**: Add `<NewsletterSignup variant="inline" />` between the blog grid and the existing CTA section

### Analytics
- Track `newsletter_signup` event via existing `useAnalytics` hook with metadata (source page, has first name)

