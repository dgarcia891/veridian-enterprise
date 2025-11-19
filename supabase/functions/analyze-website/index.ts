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
    const { websiteUrl, industry } = await req.json();
    console.log('Analyzing website:', websiteUrl);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch website content
    let websiteContent = "";
    try {
      const websiteResponse = await fetch(websiteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AIAuditBot/1.0)',
        },
      });
      websiteContent = await websiteResponse.text();
      console.log('Website content fetched, length:', websiteContent.length);
    } catch (error) {
      console.error('Error fetching website:', error);
      websiteContent = "Unable to fetch website content";
    }

    // Analyze with AI
    const systemPrompt = `You are an AI consultant analyzing a ${industry} business website to identify opportunities for AI integration.

Analyze the website and provide insights in THREE specific areas:

1. AI OPPORTUNITY ANALYSIS (3-5 specific opportunities):
   - Identify concrete areas where AI agents could be implemented
   - Focus on chat widgets, form automation, appointment scheduling, customer support, content generation
   - Be specific about WHERE on the site and HOW it would work

2. CUSTOMER EXPERIENCE GAPS (3-5 specific issues):
   - Identify friction points in the customer journey
   - Look for missing contact methods, slow response indicators, complex processes
   - Note any accessibility or usability issues

3. CONTENT ANALYSIS (3-5 specific insights):
   - Review their service offerings and how they're presented
   - Identify opportunities to personalize content or automate responses
   - Note any gaps in information that AI could help fill

Return your analysis as a JSON object with this structure:
{
  "opportunities": [
    {
      "title": "Short title",
      "description": "Detailed description of the AI opportunity",
      "impact": "high|medium|low",
      "implementation": "Description of how to implement"
    }
  ],
  "experienceGaps": [
    {
      "issue": "Short description of the gap",
      "impact": "How this affects customers",
      "solution": "How AI could solve this"
    }
  ],
  "contentInsights": [
    {
      "area": "Service/content area",
      "observation": "What you noticed",
      "recommendation": "How AI could improve this"
    }
  ]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Analyze this website for AI opportunities:\n\nURL: ${websiteUrl}\n\nWebsite Content (truncated to first 8000 chars):\n${websiteContent.substring(0, 8000)}` 
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    console.log('Website analysis complete:', JSON.stringify(analysis).substring(0, 200));

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-website function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to analyze website',
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
