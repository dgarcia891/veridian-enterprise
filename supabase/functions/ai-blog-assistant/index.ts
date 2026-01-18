import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BlogAssistantRequest {
  source_content: string;
  prompt: string;
  source_url?: string;
}

interface BlogAssistantResponse {
  title: string;
  excerpt: string;
  content: string;
  suggested_category: string;
  read_time: string;
  source_url: string | null;
  seo_title: string;
  meta_description: string;
  seo_keywords: string[];
  faq_schema: Array<{ question: string; answer: string }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { source_content, prompt, source_url } = await req.json() as BlogAssistantRequest;

    if (!source_content || !prompt) {
      return new Response(
        JSON.stringify({ error: 'source_content and prompt are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI Blog Assistant: Processing request');
    console.log('Source content length:', source_content.length);
    console.log('Prompt:', prompt);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a professional blog writer for AI Agents 3000, a company that provides AI voice receptionist services for small businesses.

Your task is to transform source articles into engaging blog posts that:
- Position AI Agents 3000 as a thought leader in AI for small business
- Use a conversational but professional tone
- Focus on practical value for small business owners
- Include actionable insights
- Are SEO-optimized with proper headings and structure

Always maintain accuracy and never fabricate statistics or quotes.

You MUST respond with a JSON object containing these exact fields:
{
  "title": "The blog post title (compelling, under 60 chars ideal for SEO)",
  "excerpt": "2-3 sentence summary of the article",
  "content": "Full article in markdown format with proper headings (## for h2, ### for h3)",
  "suggested_category": "One of: AI Technology, Business Growth, Best Practices, Tutorial, Case Studies, Industry Insights",
  "read_time": "X min read (estimate based on ~200 words per minute)",
  "seo_title": "SEO-optimized title (can differ from main title, under 60 chars)",
  "meta_description": "Meta description for search engines (under 160 chars)",
  "seo_keywords": ["array", "of", "5-8", "relevant", "keywords"],
  "faq_schema": [{"question": "Common question?", "answer": "Helpful answer"}, ...]
}

Generate 3-5 FAQ items based on the content that would be valuable for readers.`;

    const userMessage = `Transform the following source article according to these instructions:

TRANSFORMATION INSTRUCTIONS:
${prompt}

SOURCE ARTICLE:
${source_content}

${source_url ? `SOURCE URL: ${source_url}` : ''}

Remember to respond with ONLY the JSON object, no markdown code blocks or additional text.`;

    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const aiResponse = await response.json();
    console.log('AI Response received');

    const rawContent = aiResponse.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response, handling potential markdown code blocks
    let parsedContent: BlogAssistantResponse;
    try {
      // Remove markdown code blocks if present
      let cleanContent = rawContent.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();

      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', rawContent);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content', 'suggested_category', 'read_time'];
    for (const field of requiredFields) {
      if (!parsedContent[field as keyof BlogAssistantResponse]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Ensure arrays and optional fields have defaults
    const result: BlogAssistantResponse = {
      title: parsedContent.title,
      excerpt: parsedContent.excerpt,
      content: parsedContent.content,
      suggested_category: parsedContent.suggested_category,
      read_time: parsedContent.read_time,
      source_url: source_url || null,
      seo_title: parsedContent.seo_title || parsedContent.title,
      meta_description: parsedContent.meta_description || parsedContent.excerpt.slice(0, 160),
      seo_keywords: parsedContent.seo_keywords || [],
      faq_schema: parsedContent.faq_schema || [],
    };

    console.log('Successfully generated blog post:', result.title);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Blog Assistant error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate blog post'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
