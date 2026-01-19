# Architecture Specification

> **Version**: 1.0 | **Last Updated**: 2026-01-18 | **Orchestrator**: v4.5

## Overview

AI Agents 3000 is a **marketing website + SaaS platform** for an AI Voice Receptionist service targeting small businesses. It combines a public-facing marketing site with an admin dashboard for content management and analytics.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vite, React, TypeScript, TailwindCSS, shadcn/ui |
| Backend | Supabase (Auth, Database, Edge Functions) |
| AI/Voice | Retell AI (Voice & Chat Agents), Lovable AI Gateway |
| Hosting | Lovable (Frontend), Supabase (Backend) |

---

## Data Model

### Core Tables

| Table | Purpose | Owner |
|-------|---------|-------|
| `blog_posts` | Blog content with SEO metadata | Admin Dashboard |
| `user_roles` | Role-based access control | Supabase Auth |
| `analytics_events` | Custom event tracking | Edge Functions |

### Deprecated Tables (Pending Removal)

| Table | Status |
|-------|--------|
| `ai_blog_config` | Removed (FR-004) |
| `ai_blog_queue` | Removed (FR-004) |

---

## Authentication Model

| Role | Access Level |
|------|--------------|
| **Anonymous** | Public pages, blog, demos |
| **Admin** | Blog management, Analytics dashboard |

Authentication is handled via Supabase Auth with email/password. Admin access requires a row in `user_roles` with `role = 'admin'`.

---

## Architectural Boundaries

### Frontend (Lovable-Managed)

> **Source of Truth**: Lovable Editor
> **Repository Sync**: GitHub `main` branch

- All React components in `src/`
- Page routes defined in `src/App.tsx`
- UI components use shadcn/ui primitives

### Backend (GitHub-Managed)

> **Source of Truth**: GitHub
> **Deployment**: Supabase Edge Functions

| Function | Purpose | JWT |
|----------|---------|-----|
| `create-retell-call` | Initiate voice calls | No |
| `create-retell-chat` | Initiate chat sessions | No |
| `send-chat-message` | Send messages to chat | No |
| `ai-blog-assistant` | AI-powered blog generation | No |
| `generate-article` | Transform source to article | No |
| `scrape-article` | Extract content from URLs | No |
| `create-blog-post` | Create blog entries | No |
| `upload-blog-image` | Handle image uploads | No |
| `fetch-ga4-analytics` | Google Analytics data | No |
| `analyze-website` | Website audit tool | No |
| `create-payment` | Stripe payment initiation | No |
| `stripe-webhook` | Stripe event handling | No |
| `crawlable-content` | SEO-friendly content | No |

---

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | `.env` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` | Supabase anon key |
| `LOVABLE_API_KEY` | Supabase Secrets | LLM Gateway access |
| `RETELL_API_KEY` | Supabase Secrets | Voice agent access |
| `STRIPE_SECRET_KEY` | Supabase Secrets | Payment processing |
| `GA_PROPERTY_ID` | Supabase Secrets | Analytics |

---

## Safety Protocols (v4.5)

### Database Safety Lock

> ⚠️ **FORBIDDEN COMMANDS**: `supabase db push`, `db reset`, `migration:run`

Migrations must be:

1. Generated as SQL files in `supabase/migrations/`
2. Applied manually by the user via Supabase Dashboard or CLI

### Lovable Hybrid Protocol

| Change Type | Where to Edit |
|-------------|---------------|
| UI/Visual | Lovable Editor |
| Logic/Functions | GitHub |
| Database Schema | Manual SQL |

---

## File Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route components
│   ├── hooks/          # React hooks
│   └── integrations/   # Supabase client
├── supabase/
│   ├── functions/      # Edge Functions
│   ├── migrations/     # SQL migrations (40 files)
│   └── config.toml     # Function configuration
├── docs/
│   ├── project_state.json
│   ├── PRD.md
│   └── architecture.md # THIS FILE
└── .agent/             # Workflow definitions
```
