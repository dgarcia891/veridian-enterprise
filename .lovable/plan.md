

# Plan: Twilio Configuration in Admin Settings + Provisioning Edge Function

## What We're Building

A new "Twilio Configuration" section in the Admin Settings page where you enter your Twilio Account SID, Auth Token, and a default area code preference. Plus a new edge function (`provision-twilio-number`) that uses those credentials to buy a Twilio number and connect it to a Retell AI agent. The onboarding wizard's final step will call this function instead of showing a "we'll do it manually" placeholder.

## What You'll Need to Provide

After implementation, you'll enter these in the Admin Settings UI:
- **Twilio Account SID** (starts with `AC...`)
- **Twilio Auth Token** (from your Twilio Console)
- **Default Area Code** (optional — preferred area code for purchased numbers)

These get saved to `admin_settings` (key: `twilio_config`) just like the SMTP config, so the edge function reads them at runtime. No hardcoded secrets needed.

## Changes

### 1. Admin Settings Page (`src/pages/admin/Settings.tsx`)
Add a second Card below the SMTP card with:
- Twilio Account SID (text input)
- Twilio Auth Token (password input with show/hide toggle)
- Default Area Code (text input, optional)
- Enabled toggle
- Save button + Test Connection button (calls Twilio API to verify credentials)
- Response log (reuses same pattern as SMTP section)

### 2. New Edge Function: `supabase/functions/provision-twilio-number/index.ts`
- Reads `twilio_config` from `admin_settings` table
- Searches for available local numbers via Twilio REST API (`/AvailablePhoneNumbers/US/Local.json`)
- Purchases the number via Twilio REST API (`/IncomingPhoneNumbers.json`)
- Updates `customer_onboarding` row with the purchased `phone_number` and sets `provisioning_status = 'ready'`
- Returns the number to the caller

### 3. New Edge Function: `supabase/functions/test-twilio-connection/index.ts`
- Reads `twilio_config` from `admin_settings`
- Calls Twilio `/Accounts/{SID}.json` to validate credentials
- Returns success/failure for the admin UI test button

### 4. Update `supabase/config.toml`
Add entries for both new functions with `verify_jwt = false`.

### 5. Update Onboarding Step 4 (`src/components/onboarding/PhoneProvisioningStep.tsx`)
- On "Complete Setup", after saving onboarding data, invoke `provision-twilio-number` edge function
- Show a loading state while provisioning
- On success: display the assigned phone number
- On failure: fall back to "we'll provision manually" message (graceful degradation)

### 6. Update Onboarding Page (`src/pages/Onboarding.tsx`)
- Pass the `onboarding_id` from the insert to `PhoneProvisioningStep` so the edge function knows which row to update

## File Summary

| Action | File |
|--------|------|
| Modify | `src/pages/admin/Settings.tsx` — add Twilio config card |
| Create | `supabase/functions/provision-twilio-number/index.ts` |
| Create | `supabase/functions/test-twilio-connection/index.ts` |
| Modify | `supabase/config.toml` — register new functions |
| Modify | `src/components/onboarding/PhoneProvisioningStep.tsx` — call provisioning |
| Modify | `src/pages/Onboarding.tsx` — pass onboarding ID to step 4 |

No database migrations needed — Twilio credentials are stored in the existing `admin_settings` table under a new key.

