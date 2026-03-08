
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { encode } from "https://deno.land/std@0.177.0/encoding/hex.ts";
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
        const signatureHex = signatureHeader.slice(7);

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
        const calculatedSignature = new TextDecoder().decode(encode(new Uint8Array(signatureBytes)));

        if (!timingSafeEqual(calculatedSignature, signatureHex)) {
            console.error(`Signature mismatch.`);
            return new Response("Invalid Signature", { status: 401 });
        }

        // 6. Parse Body
        let payload;
        try {
            payload = JSON.parse(bodyText);
        } catch (_e) {
            return new Response("Invalid JSON", { status: 400 });
        }

        const { event, data } = payload;

        // 7. DB Interaction
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        if (event === "post.published" || event === "post.updated") {
            if (!data || !data.id || !data.title || !data.slug) {
                return new Response("Missing required fields (id, title, slug)", { status: 400 });
            }

            const contentHtml = data.content_html || data.content;
            if (!contentHtml) {
                return new Response("Missing required field content_html", { status: 400 });
            }

            const upsertData = {
                external_id: data.id,
                title: data.title,
                slug: data.slug,
                content: contentHtml,
                excerpt: data.excerpt || data.title,
                meta_description: data.meta_description || null,
                seo_title: data.meta_title || null,
                seo_keywords: data.tags || null,
                image_url: data.featured_image?.url || null,
                author_name: data.author || "Voice AI Team",
                published_at: data.published_at || new Date().toISOString(),
                status: "published",
                category: data.category || "AI Technology",
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from("blog_posts")
                .upsert(upsertData, { onConflict: "external_id" });

            if (error) {
                console.error("DB Error:", error);
                return new Response("Database Error: " + error.message, { status: 500 });
            }

        } else if (event === "post.unpublished") {
            if (!data || !data.id) return new Response("Missing id", { status: 400 });

            const slug = data.slug || `archived-${data.id}`;
            const title = data.title || "Unknown Title";
            const content = data.content_html || data.content || "";

            const upsertData = {
                external_id: data.id,
                status: "draft",
                updated_at: new Date().toISOString(),
                title,
                slug,
                content,
                excerpt: data.excerpt || title
            };

            const { error } = await supabase
                .from("blog_posts")
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
