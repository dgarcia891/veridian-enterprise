

## Fix: contentflow-webhook build error

The edge function exists but fails to build because `encodeHex` doesn't exist in `deno.land/std@0.177.0/encoding/hex.ts` — it's called `encode` and returns `Uint8Array`, not a string.

### Change

**File: `supabase/functions/contentflow-webhook/index.ts`**

Replace the `encodeHex` import and usage:
- Import `encode` instead of `encodeHex` from the hex module
- Convert the `Uint8Array` result to a hex string manually, or use a different approach
- Simplest fix: use `encode` from the same module and convert the result to a string

The signature computation section becomes:
```typescript
import { encode } from "https://deno.land/std@0.177.0/encoding/hex.ts";
// ...
const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(dataToSign));
const calculatedSignature = new TextDecoder().decode(encode(new Uint8Array(signatureBytes)));
```

### Additional consideration

The existing function upserts to `site_posts` table, which doesn't exist in the database schema. It should upsert to `blog_posts` instead, mapping ContentFlow fields to the blog_posts columns. This requires:

1. A database migration to add an `external_id` column to `blog_posts` (with a unique constraint for upsert)
2. Updating the function to map ContentFlow payload fields to `blog_posts` columns (`content`, `excerpt`, `slug`, `title`, `status`, `meta_description`, `seo_title`, etc.)

### Summary of changes

1. Fix `encodeHex` import → use `encode` from same module
2. Add `external_id` column to `blog_posts` table (migration)
3. Update upsert target from `site_posts` to `blog_posts` with correct column mapping
4. Update test script timestamp to use seconds (not milliseconds) to match the webhook's expectation

