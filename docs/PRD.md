# Retrospective PRD — AI Agents 3000

> **Generated:** 2026-01-17 | **Status:** Retrofit Audit Complete
> Features marked `(Legacy/Unverified)` require regression tests before modification.

---

## 1. Product Overview

**AI Agents 3000** is a marketing website + SaaS platform for an AI Voice Receptionist service targeting small businesses (plumbers, restaurants, roofing companies).

**Tech Stack:** Vite + React + TypeScript + Supabase (Auth, DB, Edge Functions) + Retell AI (Voice)

---

## 2. Public-Facing Features

### 2.1 Marketing Pages `(Legacy/Unverified)`

| Page | Purpose |
|------|---------|
| `/` (Index) | Hero, value prop, CTAs |
| `/about` | Company story, team |
| `/services` | Service offerings |
| `/features` | Feature breakdown |
| `/pricing` | Pricing tiers |
| `/faq` | Common questions |
| `/contact` | Contact form |
| `/blog` | Blog listing |
| `/blog/:slug` | Individual blog posts |

### 2.2 Industry Verticals `(Legacy/Unverified)`

| Page | Target |
|------|--------|
| `/plumbers` | Plumbing companies |
| `/restaurants` | Restaurants |
| `/roofing-audit` | Roofing contractors |

### 2.3 Lead Generation Tools `(Legacy/Unverified)`

| Page | Function |
|------|----------|
| `/lost-revenue-calculator` | ROI calculator showing missed call costs |
| `/roi-calculator` | Alternative ROI tool |
| `/qualification` | Multi-step lead qualification form |
| `/consultation` | Scheduling page |
| `/consultation-booked` | Post-booking confirmation |
| `/opt-in` | SMS/Email opt-in |
| `/sms-opt-in-guide` | SMS compliance guide |

### 2.4 AI Demos `(Legacy/Unverified)`

| Page | Function |
|------|----------|
| `/ai-agent-demos` | Interactive AI agent demos |
| `/ai-receptionist` | Voice receptionist demo |
| `/ai-audit` | Website audit tool |
| `/ai-insight-report` | AI-generated business report |

### 2.5 Legal Pages `(Legacy/Unverified)`

| Page | Content |
|------|---------|
| `/privacy-policy` | Privacy policy |
| `/terms-of-service` | Terms of service |
| `/cookie-policy` | Cookie policy |

---

## 3. Admin Dashboard

### 3.1 Authentication `(Legacy/Unverified)`

- Email/password login via Supabase Auth
- Role-based access control (`admin` role required)

### 3.2 Analytics Dashboard `(Legacy/Unverified)`

**File:** `Analytics.tsx` (47KB)

- Google Analytics 4 integration via Edge Function
- Date range filters: Today, Yesterday, 7d, 30d, All Time
- Metric cards: Page views, Sessions, Bounce rate
- Event tracking: CTA clicks, Consultation bookings, Calculator usage

### 3.3 Blog Management `(Legacy/Unverified)`

**Files:** `BlogAdmin.tsx`, `BlogPostForm.tsx`

- CRUD operations on `blog_posts` table
- Rich text editor for content
- Image upload via Edge Function
- Draft/Published status workflow

### 3.4 AI Content Pipeline `(Pending Removal)`

> [!NOTE]
> This module is deprecated and planned for removal as functions have moved to an external system.

**File:** `BlogAISettings.tsx`

- RSS Source management
- LLM Provider selection (Lovable/OpenAI/Anthropic)
- Prompt Template editor
- Automation Rules (Source → Prompt mapping)
- Generation Queue with status tracking
- Daily limit enforcement per pipeline

---

## 4. Backend (Edge Functions)

### 4.1 Voice/Chat Integration `(Legacy/Unverified)`

| Function | Purpose |
|----------|---------|
| `create-retell-call` | Create Retell AI voice calls |
| `create-retell-chat` | Create Retell AI chat sessions |
| `send-chat-message` | Send messages to Retell |

### 4.2 Content Generation `(Legacy/Unverified)`

| Function | Purpose |
|----------|---------|
| `process-rss-queue` | Ingest RSS feeds (Deprecated) |
| `generate-article` | Call LLM to generate blog posts |
| `scrape-article` | Extract full text from URLs |
| `create-blog-post` | Programmatic blog creation |
| `upload-blog-image` | Image upload to storage |

### 4.3 Analytics & Reporting `(Legacy/Unverified)`

| Function | Purpose |
|----------|---------|
| `fetch-ga4-analytics` | Query Google Analytics 4 API |
| `analyze-website` | AI-powered website audit |

### 4.4 Payments `(Legacy/Unverified)`

| Function | Purpose |
|----------|---------|
| `create-payment` | Stripe payment intent |
| `stripe-webhook` | Handle Stripe events |
| `create-ai-report-payment` | Payment for AI reports |
| `verify-ai-report-payment` | Verify report payment |

### 4.5 Utilities `(Legacy/Unverified)`

| Function | Purpose |
|----------|---------|
| `cleanup-error-logs` | Purge old error logs |
| `crawlable-content` | SEO-friendly content endpoint |
| `generate-sms-flow-image` | Visual SMS flow diagrams |

---

## 5. Database Schema (36 Migrations)

### Core Tables

- `blog_posts` — Blog content
- `ai_blog_config` — AI pipeline configuration
- `ai_blog_queue` — Content generation queue
- `user_roles` — RBAC
- `analytics_events` — Custom event tracking

---

## 6. Outstanding Feature Requests

> **Note:** VIP Caller List, Context-Aware Routing, and Granular Call Handling belong to a **different project** (mivoS.AI) and have been removed from this scope.

| ID | Feature | Status |
|----|---------|--------|
| FR-001 | Additional AI Demo Agents (e.g., Medical Office) | Not Started |
| FR-002 | Enhanced Blog SEO automation | Complete |
| FR-003 | AI Blog Assistant Panel | Complete |
| FR-004 | Remove Legacy AI Content Settings & RSS Scraper | Planned |

---

## 7. Known Technical Debt

| ID | Issue | Priority |
|----|-------|----------|
| TD-001 | Retell hardening awaiting deployment verification | High |
| TD-002 | No regression test suite | High |
| TD-003 | No E2E tests | Medium |
