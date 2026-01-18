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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    const { agentId } = await req.json();

    if (!agentId) {
      return new Response(
        JSON.stringify({ error: "Agent ID is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const retellApiKey = Deno.env.get('RETELL_API_KEY');
    if (!retellApiKey) {
      console.error(`[${requestId}] RETELL_API_KEY is not configured`);
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

        const response = await fetch('https://api.retellai.com/v2/create-chat', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${retellApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agent_id: agentId,
          }),
        });

        if (response.status >= 400 && response.status < 500) {
          const errorText = await response.text();
          console.error(`[${requestId}] Retell Client Error (${response.status}): ${errorText}`);
          throw new Error(`Retell API invalid request: ${errorText}`);
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`[${requestId}] Retell Server Error (${response.status}), attempting retry...`);
          throw new Error(`Retell API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log(`[${requestId}] Chat session created successfully.`);

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

    return new Response(
      JSON.stringify({
        error: lastError instanceof Error ? lastError.message : 'Failed to create chat session after multiple attempts'
      }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`[${requestId}] Unexpected error:`, error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
