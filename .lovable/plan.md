

# Full root-cause inventory: database CPU pressure

Below is every contributing factor I can identify, grouped by category. Not all are equally severe — they're ranked within each group.

## 1. Bloated / unmaintained system tables

1. **`cron.job_run_details` — 20 MB, 12,793 rows, never vacuumed.** pg_cron writes a row per job execution forever; nothing prunes it. Every dashboard query that touches cron history scans the whole table.
2. **`net._http_response` — 10 MB, churning constantly.** Every `net.http_post` from cron writes a response row. Auto-purge runs but the table never gets vacuumed, so dead tuples accumulate.
3. **`analytics_events` autovacuum is stale** — last autovacuum March 9 (6+ weeks ago), 176 dead tuples on 2,940 live rows. Every admin SELECT scans dead rows too.
4. **`edge_function_errors`, `payment_rate_limits`, `website_scans`** all have cleanup *functions* defined (`cleanup_old_error_logs`, `cleanup_old_rate_limits`, `cleanup_old_website_scans`) but **no cron job actually calls them**. They grow unbounded.

## 2. Inefficient query patterns from the app

5. **`ConversionFunnel.tsx`** does `select event_name, metadata` from `analytics_events` filtered only by `event_category`, then aggregates in JS. Full category scan on every admin page load.
6. **`FunnelDropOffAnalysis.tsx`** does the **exact same query a second time** on the same page — duplicate full scan back-to-back.
7. **`BlogAnalytics.tsx`** does a third full scan filtered by `event_name='blog_view'`, then a follow-up `blog_posts` query.
8. **No composite index on `analytics_events(event_category, created_at)`** or `(event_name, created_at)` — all three queries above do sequential scans.
9. **`Analytics.tsx` page** loads ALL of the above components simultaneously inside tabs that are mounted eagerly, so opening `/admin/analytics` fires 3+ heavy queries in parallel.
10. **GA4 edge function `fetch-ga4-analytics` is called on every dashboard mount** with no caching — adds outbound HTTP load and CPU on the function runtime.

## 3. Cron job overhead

11. **`publish-scheduled-posts` runs every 5 minutes** (288 calls/day) even when there are zero scheduled posts. Each call = HTTP request logged in `net._http_response` + a SELECT against `blog_posts`.
12. **`cleanup-error-logs-daily`** runs daily but only cleans `edge_function_errors`, leaving rate-limits and website-scans untouched.
13. **Both cron commands embed the anon JWT in plaintext** — security finding, not CPU, but worth fixing in the same migration.

## 4. Realtime / connection pressure

14. **`analytics_events` is in the realtime publication** (typical default). Every INSERT triggers WAL decoding work for realtime, even though no client subscribes to it. Removing it from the publication reduces background CPU.
15. **No connection pooling configuration visible** for the heavy admin queries — each tab open opens fresh connections through PostgREST.

## 5. Schema / dead weight

16. **`ai_blog_config` and `ai_blog_queue` tables are deprecated** (per `docs/architecture.md`) but still exist with RLS policies evaluated on every catalog lookup.
17. **`ai_audit_submissions` has 50+ columns including 7 JSONB fields** — wide rows mean more I/O per scan when admin queries `select *`.

## 6. Frontend amplification

18. **`useAnalytics` hook fires INSERT into `analytics_events` for every page view, CTA click, calendar event, and funnel stage** — high write volume on a table that's also being full-scanned by the admin dashboard.
19. **`useFunnelTracking` writes a duplicate event** for every funnel stage in addition to the regular `useAnalytics` event — write amplification.
20. **No batching** — each tracked event is its own POST/INSERT round trip.

---

## Fix plan (one migration + 3 component edits)

```text
Migration: db_performance_maintenance.sql
  - Add cron job: truncate cron.job_run_details > 7 days  (daily 3am)
  - Add cron job: truncate net._http_response > 1 day     (daily 3am)
  - Add cron job: call cleanup_old_rate_limits()          (hourly)
  - Add cron job: call cleanup_old_website_scans()        (daily)
  - VACUUM ANALYZE analytics_events
  - CREATE INDEX analytics_events (event_category, created_at)
  - CREATE INDEX analytics_events (event_name, created_at)
  - Drop deprecated tables ai_blog_config, ai_blog_queue
  - Remove analytics_events from supabase_realtime publication
  - Create RPC get_funnel_stats(date_from timestamptz)
      returns pre-aggregated counts per stage, server-side
  - Create RPC get_blog_view_stats(date_from timestamptz)
      returns top posts + daily trend + category counts
  - Reduce publish-scheduled-posts cron from */5 to */15 min

Frontend:
  src/components/admin/ConversionFunnel.tsx
    -> call rpc('get_funnel_stats', { date_from })
  src/components/admin/FunnelDropOffAnalysis.tsx
    -> reuse same RPC result via shared parent or cached query
  src/components/admin/BlogAnalytics.tsx
    -> call rpc('get_blog_view_stats', { date_from })
  src/pages/admin/Analytics.tsx
    -> hoist queries to parent, pass results to children;
       lazy-mount tab content instead of eager render
```

## Expected impact per item

| Fix | What it relieves |
|---|---|
| Truncate cron/net log tables | -30 MB scanned per dashboard load |
| Vacuum + indexes on analytics_events | seq scan → index scan |
| Server-side RPCs | 3 full scans → 1 aggregate query each |
| Lazy tab mount | 3 parallel queries → 1 |
| Remove realtime publication | continuous WAL decode CPU drops |
| Reduce cron frequency | 288/day → 96/day on `net._http_response` |
| Drop deprecated tables | smaller catalog, fewer RLS evals |

## Note on instance size

If after all of the above the CPU is still pegged under real traffic, the next lever is **upgrading the Lovable Cloud instance size** (Backend → Advanced settings → Upgrade instance). I'd recommend trying the fixes first since the current data volumes (~3k analytics rows) shouldn't tax even the smallest tier.

