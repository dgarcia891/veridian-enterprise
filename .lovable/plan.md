

## Post-Payment Onboarding Flow Plan

### Current State
- **Signup** (`/signup`): User fills in details → Stripe checkout → redirects to `/payment-success`
- **Payment Success** (`/payment-success`): Shows success → button to `/customer/register`
- **Customer Register** (`/customer/register`): Creates Supabase auth account → redirects to `/onboarding`
- **Onboarding** (`/onboarding`): 5-step wizard (Welcome → Business → Hours → Agent → Phone)

**Problem**: The signup data from checkout (`customer_signups` table) isn't linked to the user account or onboarding record. Users re-enter information they already provided.

### Proposed Flow

```text
/signup → Stripe Checkout → /payment-success?session_id=xxx
                                    ↓
                         /customer/register?session_id=xxx
                                    ↓
                    (Link signup to user, pre-fill data)
                                    ↓
                              /onboarding
                    (Pre-filled with signup data, linked to user)
```

### Implementation Steps

**1. Update Register Page to Link Signup**
- Extract `session_id` from URL params
- After successful registration, query `customer_signups` to find the matching record
- Update `customer_signups` with the new `user_id` (need migration to add column)
- Pre-fill registration form with email/company from Stripe session metadata

**2. Add `user_id` Column to `customer_signups` Table**
- Database migration to add nullable `user_id uuid` column referencing auth.users
- Update RLS policies to allow linking

**3. Update Onboarding to Pre-fill from Signup Data**
- Query `customer_signups` where user_id matches current user
- Pre-fill `businessName`, `industry` from the signup record
- Link `customer_onboarding.signup_id` to the `customer_signups.id`

**4. Create Edge Function to Verify Session & Get Signup Data**
- New `verify-checkout-session` function
- Takes session_id, returns signup details (email, company, plan)
- Used by Register page to pre-fill and validate

**5. Update Stripe Webhook to Store Email in Metadata**
- Already stores `signup_id` in metadata
- Ensure `email` is retrievable for lookup

### Technical Details

**Database Migration:**
```sql
ALTER TABLE customer_signups ADD COLUMN user_id uuid REFERENCES auth.users(id);
CREATE INDEX idx_customer_signups_user_id ON customer_signups(user_id);
```

**RLS Policy Update:**
```sql
CREATE POLICY "Users can update own signup" ON customer_signups
  FOR UPDATE USING (auth.uid() = user_id);
```

**Files to Modify:**
- `src/pages/customer/Register.tsx` – Add session lookup, pre-fill, link signup
- `src/pages/Onboarding.tsx` – Query signup data, pre-fill business profile
- `supabase/functions/verify-checkout-session/index.ts` – New edge function
- Database migration for `customer_signups.user_id`

