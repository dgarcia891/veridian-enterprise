

## Add Competitor Comparison Page: AI Agents 3000 vs Ruby Receptionists

### What is Ruby Receptionists?
Ruby is a well-known human receptionist service targeting small businesses. Their pricing starts around $235/mo for 50 minutes, with per-minute overage fees. They offer live human receptionists (not AI), business-hours coverage with limited after-hours, and English-only support.

### Changes

**1. Create `src/pages/compare/VsRubyReceptionists.tsx`**
Follow the exact same structure as `VsSmithAI.tsx`:
- SEO `<Helmet>` with title, meta description, canonical URL (`/compare/vs-ruby-receptionists`), OG tags, and JSON-LD
- Hero section: "AI Agents 3000 vs Ruby Receptionists" with pricing hook ($99/mo vs $235/mo)
- 3 Key Differentiators cards:
  - **Save 58%+ on Monthly Costs** — $99/mo vs $235/mo, no per-minute overage fees
  - **True 24/7 Coverage** — Ruby offers business-hours human receptionists; AI never sleeps
  - **Instant Setup vs Weeks** — Ruby requires onboarding and training; we're live in 10 minutes
- ComparisonTable with ~15 feature rows (pricing, 24/7, AI vs human, languages, setup time, per-minute fees, appointment booking, CRM, etc.)
- Annual Cost Comparison cards ($1,188–$7,200 vs $2,820–$12,000+)
- Final CTA: "Ready to Switch from Ruby?"

**2. Add route in `src/App.tsx`**
- Add lazy import for `VsRubyReceptionists`
- Add `<Route path="/compare/vs-ruby-receptionists" element={<VsRubyReceptionists />} />`

**3. Add link on `src/pages/Pricing.tsx`**
- Add a fourth "Compare" button alongside the existing three, linking to `/compare/vs-ruby-receptionists`

### Feature comparison data

| Feature | AI Agents 3000 | Ruby Receptionists |
|---|---|---|
| Starting Price | $99/mo | $235/mo (50 min) |
| 24/7 Availability | ✓ | Business hours only |
| AI-Powered | ✓ | Human receptionists |
| Unlimited Calls (Pro) | $600/mo | Per-minute overage |
| Multi-Language | 10+ languages | English only |
| Setup Time | 10 minutes | 1–2 weeks |
| Lead Qualification | ✓ | ✓ |
| Appointment Booking | ✓ | ✓ |
| CRM Integration | Pro plan | Limited |
| Per-Minute Overage | None on Pro | $5.50+/min |
| Setup Fee | $0 | $0 |
| Contract Required | ✗ | ✗ |
| SMS & Chat Widget | Add-on available | ✗ |
| Custom AI Training | Pro plan | N/A |
| Analytics Dashboard | Growth & Pro | Basic |

