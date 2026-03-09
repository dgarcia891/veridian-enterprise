

## What's already built

The payment infrastructure is largely complete:

- **Signup form** (`/signup`) — collects name, email, phone, company, industry, plan selection
- **`create-payment` edge function** — creates Stripe checkout sessions with real price IDs already hardcoded (`price_1SMHz0BAEKQ21Bqow3FGFyWS` for monthly, `price_1SMI1BBAEKQ21BqoFmlpkF41` for annual, `price_1SMI1kBAEKQ21Bqovt7fVaiE` for medical)
- **`stripe-webhook` edge function** — listens for `checkout.session.completed`, `payment_intent.succeeded/failed`, `subscription.deleted` and updates the `customer_signups` table
- **`customer_signups` table** — stores signup data with Stripe customer/payment/subscription IDs and `payment_status`
- **`/payment-success` page** — confirms payment and redirects to account creation
- **`/customer/register`** — creates an authenticated account post-payment

## What's blocking you from going live

There are **3 critical gaps**:

### 1. Stripe secrets are not configured (blocker)
The `create-payment` function reads from `STRIPE_SECRET_KEY_TEST` or `STRIPE_SECRET_KEY_LIVE` (plus `STRIPE_MODE`), but the `stripe-webhook` function also needs `STRIPE_WEBHOOK_SECRET_TEST` or `STRIPE_WEBHOOK_SECRET_LIVE`. These secrets need to be stored in the backend.

### 2. Stripe webhook endpoint is not registered (blocker)
The `stripe-webhook` edge function exists and is deployed, but Stripe's dashboard needs to be pointed at your edge function URL:
`https://kijvqjmnrmamgerysbxv.supabase.co/functions/v1/stripe-webhook`

Without this, payments succeed in Stripe but the `customer_signups` table never gets updated to `"completed"`.

### 3. Pricing page plans don't match the payment function (important)
`Pricing.tsx` and `Signup.tsx` show plans as `starter` / `growth` / `professional`, but `create-payment` only maps `annual`, `medical`, and falls through to the monthly price ID for everything else. The Starter ($99) and Growth ($199) plans don't have separate Stripe price IDs — they all hit the same price. This needs to be reconciled before launch.

### 4. Minor: the pricing shown on the comparison pages ($99/mo) differs from the current Signup page plan pricing ($99/$199/$600)
The comparison pages advertise "$99/mo" as the primary price — ensure the landing messaging is consistent with what users actually pay at checkout.

## Plan

This is a configuration/secrets task primarily — I'll check what secrets are already stored, then guide you through the two steps needed to go live. No new code pages needed.

**Step 1**: Check which Stripe secrets are already stored
**Step 2**: If missing, prompt you to add `STRIPE_SECRET_KEY_LIVE` (or `_TEST`), `STRIPE_MODE`, and `STRIPE_WEBHOOK_SECRET`
**Step 3**: Fix the plan→priceId mapping in `create-payment` so starter/growth/professional each have the correct Stripe price IDs
**Step 4**: Display the webhook endpoint URL you need to register in your Stripe dashboard

This will make the checkout flow fully functional end-to-end.

**Do you want me to proceed with Step 3 (fixing the plan mapping) now, and tell you exactly what to set up in Stripe for Steps 1-2?** Or would you prefer I also create the missing Stripe products/prices for the Starter and Growth tiers?

