# Deployment Log

## [2026-01-18] Retell Hardening & Blog SEO Automation 🚀

### Status: Pushed to GitHub (Deployment ready for Lovable Sync/Publish)

### Summary of Changes

- **TD-001: Retell Hardening**:
  - Implemented exponential backoff retry logic (3x) for all Retell Edge Functions.
  - Added request ID tracing and structured logging for better observability.
  - Hardened `create-retell-call`, `create-retell-chat`, and `send-chat-message`.
- **FR-002: Enhanced Blog SEO**:
  - **Database**: Added `seo_title`, `meta_description`, `seo_keywords`, and `faq_schema` to `blog_posts`.
  - **AI Pipeline**: Updated `generate-article` with SEO expert prompts and FAQ generation logic.
  - **Frontend**: Integrated SEO meta tags and FAQ Schema (JSON-LD) into `BlogPost.tsx`.
- **FR-001**: Added Medical Office Agent demo and industry pages.
- **TD-002**: Initialized regression test suite for routes.

### Pre-Deployment Checks

- [x] Build Success: `npm run build` passed successfully.
- [x] Linting: Addressed critical lint errors in core components.
- [x] Repository: Changes pushed to `main` branch (**Commit: a227ab4**).

### Deployment Method

- **GitHub**: Pushed to `main`.
- **Supabase**: **ACTION REQUIRED** - Run `supabase db push` and `supabase functions deploy`.
- **Final Step**: User to click "Sync" in Lovable dashboard.

---

## [2026-01-16] Analytics Date Filters 🚀

### Status: Deployed (GitHub Push Complete)

### Summary of Changes

- Added **"Today"** filter option (default).
- Added **"Yesterday"** filter option between Today and 7 Days.
- Filter now shows: Today | Yesterday | 7 Days | 30 Days | All Time

### Pre-Deployment Checks

- [x] Linting passed for `Analytics.tsx`.
- [x] Git Sync: Changes pushed to `main` branch (**Commits: 4e2404c, dc8d855, f185ecd**).

### Deployment Method

- Code pushed to `main`.
- Sync Status: Ready for Lovable Publish.

---

## [2026-01-15] Analytics & Calendar Fix

### Status: Pushed to GitHub (Deployment in progress via user interaction)

### Summary of Changes

- **Calendar Fix**: Updated `src/config/calcom.ts` with real credentials (`david-garcia-89` / `ai3kdemocall`).
- **Analytics Integration**: Added tracking for:
  - `consultation_booked` in `ConsultationBooked.tsx`
  - `roi_calculator_used` in `InteractiveCalculator.tsx`
  - `blog_view` in `BlogPost.tsx`
  - `cta_click` in `Navigation.tsx` and `ProblemStatsSection.tsx`

### Pre-Deployment Checks

- [x] Linting passed for modified files.
- [x] Repository verified (`git push` successful).
- [x] Semantic commit message used.

### Deployment Method

- Code pushed to `main` branch.
- Final step: User to click "Share -> Publish" or "Sync" in Lovable dashboard.

---

## [2026-01-15] Queue Enhancements & Per-Pipeline Limits 🚀

### Status: Deployed (Edge Function Live)

### Summary of Changes

- **Per-Pipeline Limits**: Added `daily_limit` field to `automation_rule` config and enforced it in the backend.
- **Enhanced Queue UI**:
  - Added Action buttons (Publish, Reject, Retry) with tooltips.
  - Added "Content Preview" dialog via clickable titles.
  - Interactive status badges and loaders.
- **Backend Logic**: Updated `generate-article` Edge Function with per-source daily limit checks.

### Pre-Deployment Checks

- [x] Linting: Fixed all `AdminAISettings.tsx` and `generate-article` lint errors.
- [x] Verification: Successfully tested limit enforcement and UI actions locally.
- [x] Git Sync: Changes pushed to `main` branch (**Commit: f4f6f38**).

### Deployment Method

- **GitHub**: Pushed to `main`.
- **Supabase**: Edge Function deployment `generate-article` COMPLETE (via Lovable).
- **Secrets**: GA4 Credentials (`GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT`) set in Supabase.
- **Final Step**: User to run `supabase functions deploy generate-article` and sync with Lovable.

## [2026-01-15] Analytics UX & Detailed Tracking 🚀

### Status: Deployed (GitHub Push Complete)

### Summary of Changes

- **Interactive Metrics**: Linked all dashboard metric cards to the detailed event ledger.
- **Auto-scroll**: Implemented `useRef` based smooth auto-scroll to logs upon card selection.
- **Detailed Ledger**: Added "Raw Events Ledger" table with Timestamp, IP, Page, and Meta filtering.
- **Visual Feedback**: Added pulsing "Viewing Logs ↓" indicators to cards for better UX.
- **Privacy Fix**: Repaired dashboard state so "Ignoring My Stats" toggle updates the view instantly.

### Pre-Deployment Checks

- [x] Build Success: `npm run build` passed.
- [x] Live Data Check: Verified 3 production database clicks via browser agent.
- [x] Git Sync: Final changes pushed to `main` branch.

### Deployment Method

- Commit: `2876f6c`
- Sync Status: Ready for Lovable Publish.
