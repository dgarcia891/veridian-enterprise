

# Tiered Pricing Structure

## Overview
Add Starter ($99/mo) and Growth ($199/mo) tiers alongside the existing Professional ($600/mo) plan across all pricing surfaces: the dedicated Pricing page, the reusable Pricing component, the services data, and the AI Receptionist page.

## Tier Structure

```text
┌─────────────┬──────────────┬──────────────┐
│   Starter   │    Growth    │ Professional │
│   $99/mo    │   $199/mo    │   $600/mo    │
│             │  * Popular * │              │
├─────────────┼──────────────┼──────────────┤
│ 100 calls   │ 500 calls    │ Unlimited    │
│ Bus. hours  │ 24/7         │ 24/7         │
│ 1 language  │ 5 languages  │ 10+ langs    │
│ Basic FAQ   │ Lead qual.   │ Full qual.   │
│ Email notif │ Appt booking │ CRM integr.  │
│ —           │ SMS notif    │ Analytics    │
│ —           │ Basic analytics│ Priority    │
│ Email only  │ Email+chat   │ Dedicated    │
└─────────────┴──────────────┴──────────────┘
```

## Files to Change

### 1. `src/data/services.ts`
- Update Voice AI Receptionist `pricing` array from 1 plan to 3 tiers (Starter, Growth, Professional)
- Mark Growth as `popular: true`

### 2. `src/pages/Pricing.tsx`
- Replace single-card layout with 3-column grid
- Add all three tiers with features
- Update subtitle text to "Plans starting at $99/month"

### 3. `src/components/Pricing.tsx` (reusable component)
- Update default subtitle to reflect new starting price
- Grid already supports 3 columns — no layout changes needed

### 4. `src/hooks/usePlanPricing.ts`
- Add `starter` and `growth` plan types
- Update pricing values for each tier

### 5. `src/pages/Services.tsx`
- "Starting at" price will automatically update since it reads `service.pricing[0]`
- No changes needed (Starter will be index 0)

### 6. `src/pages/AIReceptionist.tsx`
- No changes needed — passes `primaryService.pricing` to Pricing component, which already renders a grid

