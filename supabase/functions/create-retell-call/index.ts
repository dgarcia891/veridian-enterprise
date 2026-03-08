import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    const { agentId } = await req.json();

    console.log(`[${requestId}] Starting Retell call creation for agent: ${agentId}`);

    if (!agentId) {
      console.warn(`[${requestId}] Missing Agent ID`);
      return new Response(
        JSON.stringify({ error: "Agent ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const retellApiKey = Deno.env.get('RETELL_API_KEY');
    if (!retellApiKey) {
      console.error(`[${requestId}] RETELL_API_KEY environment variable not set`);
      return new Response(
        JSON.stringify({ error: 'System configuration error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    let lastError;
    let attempt = 0;

    // Retry Logic Loop
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
          body: JSON.stringify({
            agent_id: agentId,
          }),
        });

        // If client error (4xx), do not retry
        if (response.status >= 400 && response.status < 500) {
          const errorBody = await response.text();
          console.error(`[${requestId}] Retell Client Error (${response.status}): ${errorBody}`);
          throw new Error(`Retell API invalid request: ${errorBody}`);
        }

        // If server error (5xx), valid for retry
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
          // Exponential backoff
          const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
          await delay(backoff);
        }
      }
    }

    // All retries failed
    console.error(`[${requestId}] All ${MAX_RETRIES} attempts failed.`);
    return new Response(
      JSON.stringify({
        error: lastError instanceof Error ? lastError.message : 'Failed to establish voice connection after multiple attempts'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 502, // Bad Gateway
      }
    );

  } catch (error) {
    console.error(`[${requestId}] Unexpected error in create-retell-call:`, error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
