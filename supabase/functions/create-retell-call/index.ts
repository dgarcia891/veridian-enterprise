import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;
const RATE_LIMIT_PER_HOUR = 5;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    // Rate limit anonymous callers by IP to prevent Retell credit theft
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (supabaseUrl && serviceKey && clientIp !== 'unknown') {
      const supabase = createClient(supabaseUrl, serviceKey);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('event_name', 'retell_call_create')
        .eq('ip_address', clientIp)
        .gte('created_at', oneHourAgo);

      if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
        console.warn(`[${requestId}] Rate limit exceeded for IP ${clientIp}`);
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Record this attempt (server-side ip; the scrub trigger only nulls anon-client inserts)
      await supabase.from('analytics_events').insert({
        event_category: 'rate_limit',
        event_name: 'retell_call_create',
        ip_address: clientIp,
        metadata: { request_id: requestId },
      });
    }

    const { agentId } = await req.json();

    console.log(`[${requestId}] Starting Retell call creation for agent: ${agentId}`);

    if (!agentId || typeof agentId !== 'string' || agentId.length > 200) {
      console.warn(`[${requestId}] Invalid Agent ID`);
      return new Response(
        JSON.stringify({ error: "Valid Agent ID is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const retellApiKey = Deno.env.get('RETELL_API_KEY');
    if (!retellApiKey) {
      console.error(`[${requestId}] RETELL_API_KEY environment variable not set`);
      return new Response(
        JSON.stringify({ error: 'System configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let lastError;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        attempt++;
        if (attempt > 1) {
          console.log(`[${requestId}] Retry attempt ${attempt}/${MAX_RETRIES}`);
        }

        const response = await fetch('https://api.retellai.com/create-web-call', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${retellApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ agent_id: agentId }),
        });

        if (response.status >= 400 && response.status < 500) {
          const errorBody = await response.text();
          console.error(`[${requestId}] Retell Client Error (${response.status}): ${errorBody}`);
          throw new Error(`Retell API invalid request: ${errorBody}`);
        }

        if (!response.ok) {
          const errorBody = await response.text();
          console.warn(`[${requestId}] Retell Server Error (${response.status}), attempting retry...`);
          throw new Error(`Retell API error: ${response.status} ${errorBody}`);
        }

        const data = await response.json();
        console.log(`[${requestId}] Call created successfully. Call ID: ${data.call_id}`);

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });

      } catch (err) {
        lastError = err;
        console.error(`[${requestId}] Attempt ${attempt} failed:`, err);

        if (attempt < MAX_RETRIES) {
          const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
          await delay(backoff);
        }
      }
    }

    console.error(`[${requestId}] All ${MAX_RETRIES} attempts failed.`);
    return new Response(
      JSON.stringify({
        error: lastError instanceof Error ? lastError.message : 'Failed to establish voice connection after multiple attempts'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
    );

  } catch (error) {
    console.error(`[${requestId}] Unexpected error in create-retell-call:`, error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
