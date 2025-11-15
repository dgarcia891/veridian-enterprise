import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentId } = await req.json();

    if (!agentId) {
      throw new Error("Agent ID is required");
    }

    const retellApiKey = Deno.env.get('RETELL_API_KEY');
    if (!retellApiKey) {
      throw new Error('Service configuration error');
    }

    const response = await fetch('https://api.retellai.com/create-chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
      }),
    });

    console.log('Retell API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API call failed', { 
        status: response.status, 
        statusText: response.statusText,
        error: errorText,
        agentId: agentId 
      });
      
      if (response.status === 404) {
        throw new Error(`Agent not found. Please verify agent ID '${agentId}' exists in your Retell dashboard.`);
      }
      
      throw new Error(`Retell API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Chat session creation failed', { 
      message: error.message,
      stack: error.stack 
    });
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create chat session' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
