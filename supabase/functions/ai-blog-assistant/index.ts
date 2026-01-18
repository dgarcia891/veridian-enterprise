import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// LLM Provider Configurations
const LLM_ENDPOINT = 'https://ai.gateway.lovable.dev/v1/chat/completions';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { source_content, prompt, source_url } = await req.json();

    if (!source_content || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Source content and prompt are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating AI blog draft...');

    const systemPrompt = `You are a professional blog writer and SEO expert for AI Agents 3000, a company that provides AI voice receptionist services for small businesses.
Your task is to transform source articles or notes into engaging, SEO-optimized blog posts.
The tone should be conversational, professional, and value-driven for small business owners.
Position AI Agents 3000 as a thought leader in AI-driven customer service.
Always generate optimized SEO metadata and a helpful FAQ section based on the content.`;

    const userPrompt = `Source Article/Notes:\n${source_content}\n\nTransformation Instructions:\n${prompt}\n\nTarget URL (for reference):\n${source_url || 'N/A'}`;

    // Using tool calling/structured output for reliability
    const body = {
      model: 'google/gemini-2.0-flash-exp:free', // Default to a powerful but cost-effective model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'create_blog_post',
            description: 'Generate a structured blog post with SEO data',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Catchy title' },
                excerpt: { type: 'string', description: '2-3 sentence teaser' },
                content: { type: 'string', description: 'Full article in markdown format' },
                suggested_category: {
                  type: 'string',
                  enum: ['AI Technology', 'Business Growth', 'Best Practices', 'Tutorial', 'Case Studies', 'Industry Insights']
                },
                read_time: { type: 'string', description: 'Estimated read time (e.g. "5 min read")' },
                seo_title: { type: 'string', description: 'Optimized title for SERPs' },
                meta_description: { type: 'string', description: 'Compelling snippet for search results' },
                seo_keywords: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Relevant search terms'
                },
                faq_schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      question: { type: 'string' },
                      answer: { type: 'string' }
                    },
                    required: ['question', 'answer']
                  },
                  description: '3-5 frequently asked questions'
                }
              },
              required: ['title', 'excerpt', 'content', 'suggested_category', 'read_time', 'seo_title', 'meta_description', 'seo_keywords', 'faq_schema']
            }
          }
        }
      ],
      tool_choice: { type: 'function', function: { name: 'create_blog_post' } }
    };

    const response = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    // Extract tool call arguments
    const toolCall = data.choices[0].message.tool_calls[0];
    const result = JSON.parse(toolCall.function.arguments);

    console.log('Successfully generated blog draft:', result.title);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ...result,
          source_url: source_url || null
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-blog-assistant:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Transformation failed'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
