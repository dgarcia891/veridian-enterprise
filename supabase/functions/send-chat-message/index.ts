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
    const { chatId, content } = await req.json();
    const retellApiKey = Deno.env.get('RETELL_API_KEY');

    if (!retellApiKey) {
      throw new Error('RETELL_API_KEY not configured');
    }

    console.log('Sending message to Retell chat:', chatId);

    const response = await fetch('https://api.retellai.com/create-chat-completion', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        content: content,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Retell API error:', response.status, errorText);
      throw new Error(`Failed to send message: ${errorText}`);
    }

    const data = await response.json();
    console.log('Received response from Retell');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending chat message:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
