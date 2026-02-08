
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { encodeHex } from "https://deno.land/std@0.177.0/encoding/hex.ts";
import { timingSafeEqual } from "../_shared/timingSafeEqual.ts";

const WEBHOOK_SECRET = Deno.env.get("CONTENTFLOW_WEBHOOK_SECRET") || "test_secret";
const MAX_TIMESTAMP_DIFF = 300; // 5 minutes in seconds

serve(async (req) => {
    try {
        // 1. Method Check
        if (req.method !== "POST") {
            return new Response("Method Not Allowed", { status: 405 });
        }

        // 2. Headers Check
        const timestampHeader = req.headers.get("X-CFS-Timestamp");
        const signatureHeader = req.headers.get("X-CFS-Signature");

        if (!timestampHeader || !signatureHeader) {
            return new Response("Missing Security Headers", { status: 401 });
        }

        // 3. Strict Signature Format Check
        if (!signatureHeader.startsWith("sha256=")) {
            return new Response("Invalid Signature Format", { status: 401 });
        }
        const signatureHex = signatureHeader.slice(7); // Remove 'sha256=' prefix

        // 4. Replay Attack Protection
        const timestamp = parseInt(timestampHeader, 10);
        const nowSeconds = Math.floor(Date.now() / 1000);

        if (isNaN(timestamp)) {
            return new Response("Invalid Timestamp", { status: 401 });
        }

        if (Math.abs(nowSeconds - timestamp) > MAX_TIMESTAMP_DIFF) {
            console.warn(`Timestamp rejected: ${timestamp} vs Now: ${nowSeconds}`);
            return new Response("Timestamp out of bounds", { status: 401 });
        }

        // 5. Verify Signature (HMAC-SHA256)
        const bodyText = await req.text();
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(WEBHOOK_SECRET),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify", "sign"]
        );

        const dataToSign = `${timestamp}.${bodyText}`;
        const signatureBytes = await crypto.subtle.sign(
            "HMAC",
            key,
            encoder.encode(dataToSign)
        );
        const calculatedSignature = encodeHex(signatureBytes);

        if (!timingSafeEqual(calculatedSignature, signatureHex)) {
            console.error(`Signature mismatch.`);
            return new Response("Invalid Signature", { status: 401 });
        }

        // 6. Parse Body
        let payload;
        try {
            payload = JSON.parse(bodyText);
        } catch (e) {
            return new Response("Invalid JSON", { status: 400 });
        }

        const { event, data } = payload;

        // 7. DB Interaction
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        if (event === "post.published" || event === "post.updated") {
            // Validation
            if (!data || !data.id || !data.title || !data.slug) {
                return new Response("Missing required fields (id, title, slug)", { status: 400 });
            }

            // Fallback for content
            const contentHtml = data.content_html || data.content;
            if (!contentHtml) {
                return new Response("Missing required field content_html", { status: 400 });
            }

            const upsertData = {
                external_id: data.id,
                title: data.title,
                slug: data.slug,
                content_html: contentHtml,
                excerpt: data.excerpt || null,
                meta_title: data.meta_title || null,
                meta_description: data.meta_description || null,
                tags: data.tags || null,
                featured_image_url: data.featured_image?.url || null,
                featured_image_alt: data.featured_image?.alt || null,
                published_at: data.published_at || new Date().toISOString(),
                status: "published",
                raw_payload: payload,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from("site_posts")
                .upsert(upsertData, { onConflict: "external_id" });

            if (error) {
                console.error("DB Error:", error);
                return new Response("Database Error: " + error.message, { status: 500 });
            }

        } else if (event === "post.unpublished") {
            if (!data || !data.id) return new Response("Missing id", { status: 400 });

            // If record doesn't exist, upsert with archived status
            // We need slug if we are creating new, but if it's missing we can try to find existing
            // But upsert requires all non-nulls if it's an insert.
            // Strategy: Try update first, if matches 0 rows, check if we have enough info to insert.
            // Actually, user said: "if record doesn’t exist yet, still upsert a record with external_id, slug (if present), status=archived"
            // This implies slug might be optional for unpublished? But table says slug is NOT NULL.
            // So we MUST have slug to insert. If slug is missing and row missing -> Error?
            // Let's assume data.slug is sent in unpublished event too if available or we check.

            const slug = data.slug || `archived-${data.id}`; // Fallback if strictly needed by DB
            const title = data.title || "Unknown Title";
            const content_html = data.content_html || "";

            const upsertData = {
                external_id: data.id,
                status: "archived",
                updated_at: new Date().toISOString(),
                // Minimal fields for valid insert if row missing
                title: title,
                slug: slug,
                content_html: content_html
            };

            // We use upsert to handle both cases (update existing or create archived placeholder)
            const { error } = await supabase
                .from("site_posts")
                .upsert(upsertData, { onConflict: "external_id" });

            if (error) {
                console.error("DB Error:", error);
                return new Response("Database Error: " + error.message, { status: 500 });
            }
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err: any) {
        console.error("Webhook Error:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
});
