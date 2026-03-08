

# Plan: Stripe Checkout + Self-Service Onboarding Wizard

## Summary
Extend the existing `create-payment` edge function flow to let customers purchase a plan directly from the pricing page, then guide them through a multi-step onboarding wizard to configure their AI agent. Twilio integration is deferred — the wizard collects preferences now and shows a placeholder for phone number provisioning.

## Database Changes

**New table: `customer_onboarding`** — stores the self-service configuration per signup.

```sql
CREATE TABLE public.customer_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signup_id uuid REFERENCES public.customer_signups(id) ON DELETE CASCADE,
  business_name text,
  business_hours jsonb DEFAULT '{}',
  greeting_message text,
  services_offered text[],
  faq_entries jsonb DEFAULT '[]',
  voicemail_enabled boolean DEFAULT true,
  preferred_voice text DEFAULT 'professional-female',
  phone_number text,          -- will be populated when Twilio is wired up
  retell_agent_id text,       -- will be populated when Retell provisioning is wired up
  provisioning_status text DEFAULT 'pending',  -- pending | ready | failed
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.customer_onboarding ENABLE ROW LEVEL SECURITY;

-- Edge functions use service role; customers access via their signup email match
CREATE POLICY "Service role full access" ON public.customer_onboarding FOR ALL USING (true) WITH CHECK (true);
```

**Modify `customer_signups` RLS** — add an admin SELECT policy so the leads dashboard and onboarding flow can read signups (currently `prevent_all_select` blocks everything including service role via client):

```sql
CREATE POLICY "Admins can view signups"
ON public.customer_signups FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
```

## New Pages & Components

### 1. `/signup` — Signup + Checkout Page
- Collects: name, email, phone, company, industry, plan selection (Starter/Growth/Professional)
- On submit: inserts into `customer_signups`, then invokes existing `create-payment` edge function
- Redirects to Stripe Checkout
- After Stripe: redirects to `/payment-success`

### 2. `/payment-success` — Payment Confirmation + Onboarding Entry
- Reads `session_id` from URL params
- Shows confirmation message with plan details
- CTA: "Set Up Your AI Agent" → navigates to `/onboarding`

### 3. `/onboarding` — Multi-Step Self-Service Wizard
Four steps with progress indicator:

**Step 1: Business Profile**
- Business name, industry, services offered (multi-select chips)

**Step 2: Business Hours & Availability**  
- Day-by-day toggle + time range pickers
- After-hours behavior (voicemail vs. text notification)

**Step 3: AI Agent Configuration**
- Custom greeting message (with preview/playback placeholder)
- FAQ entries (add/remove key-value pairs: question + answer)
- Voice selection (dropdown: professional-female, professional-male, friendly-female, friendly-male)

**Step 4: Phone Number (Placeholder)**
- "Your dedicated phone number will be provisioned shortly"
- Shows a status card with `provisioning_status`
- Admin notification sent via `notify-admin-email` with onboarding details
- CTA: "Done — We'll email you when your number is ready"

Each step saves progress to `customer_onboarding` so the user can resume.

### 4. Pricing Page Update (`src/pages/Pricing.tsx`)
- Change plan CTAs from navigating to `/schedule-consultation` to `/signup?plan=starter|growth|professional`
- Pre-select the plan on the signup page based on URL param

## Edge Function Changes

**`create-payment/index.ts`** — No changes needed. Already supports plan types and `customer_signups` validation.

**`notify-admin-email/index.ts`** — Add a new `notificationType: "new_signup"` template that includes the onboarding configuration details (business name, hours, FAQ, voice preference) so the admin can manually provision while Twilio is not yet integrated.

## File Summary

| Action | File |
|--------|------|
| Create | `src/pages/Signup.tsx` |
| Create | `src/pages/PaymentSuccess.tsx` |
| Create | `src/pages/Onboarding.tsx` |
| Create | `src/components/onboarding/BusinessProfileStep.tsx` |
| Create | `src/components/onboarding/BusinessHoursStep.tsx` |
| Create | `src/components/onboarding/AgentConfigStep.tsx` |
| Create | `src/components/onboarding/PhoneProvisioningStep.tsx` |
| Create | `src/components/onboarding/OnboardingProgress.tsx` |
| Modify | `src/pages/Pricing.tsx` — CTAs point to `/signup?plan=X` |
| Modify | `src/App.tsx` — add routes for `/signup`, `/payment-success`, `/onboarding` |
| Modify | `supabase/functions/notify-admin-email/index.ts` — add `new_signup` template |
| Migration | Create `customer_onboarding` table + admin SELECT policy on `customer_signups` |

## Technical Notes
- The existing `create-payment` function reads from `customer_signups` and creates Stripe Checkout sessions with the correct price IDs (monthly/annual/medical). The signup page will insert into `customer_signups` first, then invoke the function.
- Onboarding data is saved incrementally per step so users can close the browser and resume.
- When Twilio credentials are added later, the `PhoneProvisioningStep` will be upgraded to call a new edge function that purchases a number and creates a Retell agent.

