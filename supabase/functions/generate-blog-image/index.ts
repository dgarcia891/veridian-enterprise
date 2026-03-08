import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { title, excerpt, category } = await req.json();
    if (!title) throw new Error("Title is required");

    const prompt = `Create a professional, modern blog header image for an article titled "${title}". The article is about: ${excerpt || title}. Category: ${category || "Technology"}. Style: Clean, professional, tech-forward design with subtle gradients. No text in the image. Wide landscape format (16:9 aspect ratio). High quality, suitable for a business blog.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [{ role: "user", content: prompt }],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();

    // Extract base64 image from the response
    const choice = data.choices?.[0];
    const images = choice?.message?.images;
    let base64Data: string | null = null;
    let mimeType = "image/png";

    // Images are in message.images array
    if (Array.isArray(images)) {
      for (const img of images) {
        if (img.type === "image_url" && img.image_url?.url) {
          const match = img.image_url.url.match(
            /^data:(image\/\w+);base64,(.+)$/s
          );
          if (match) {
            mimeType = match[1];
            base64Data = match[2];
          }
          break;
        }
      }
    }

    if (!base64Data) {
      console.error("Unexpected AI response structure:", JSON.stringify(data).slice(0, 500));
      throw new Error("No image returned from AI");
    }

    // Decode base64 to binary
    const binaryStr = atob(base64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const ext = mimeType === "image/jpeg" ? "jpg" : "png";
    const filename = `ai-generated/${Date.now()}-${title.slice(0, 30).replace(/[^a-z0-9]/gi, "-").toLowerCase()}.${ext}`;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filename, bytes, { contentType: mimeType, upsert: true });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: publicUrlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(uploadData.path);

    return new Response(
      JSON.stringify({ success: true, url: publicUrlData.publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-blog-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
