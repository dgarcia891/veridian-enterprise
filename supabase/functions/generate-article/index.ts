import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// LLM Provider Configurations
const LLM_ENDPOINTS = {
    lovable: 'https://ai.gateway.lovable.dev/v1/chat/completions',
    openai: 'https://api.openai.com/v1/chat/completions',
    anthropic: 'https://api.anthropic.com/v1/messages',
};

// Replace placeholders in prompts
function replacePlaceholders(template: string, vars: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
}

// Helper to call LLM
async function callLLM(provider: 'lovable' | 'openai' | 'anthropic', model: string, apiKey: string, systemPrompt: string, userPrompt: string, jsonMode: boolean = true): Promise<string> {
    console.log(`Calling LLM: ${provider} - ${model}`);

    if (provider === 'anthropic') {
        const response = await fetch(LLM_ENDPOINTS.anthropic, {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: model,
                max_tokens: 4096,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.content[0].text;
    } else {
        // OpenAI-compatible format (Lovable and OpenAI)
        const body: any = {
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        };

        if (jsonMode) {
            body.response_format = { type: 'json_object' };
        }

        const response = await fetch(LLM_ENDPOINTS[provider], {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LLM API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}

// Parse JSON from AI response (handles markdown code blocks)
function parseJsonResponse(text: string): { title: string; excerpt: string; content: string } {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();

    try {
        return JSON.parse(jsonStr);
    } catch {
        // Fallback: try to extract fields manually
        const titleMatch = text.match(/"title"\s*:\s*"([^"]+)"/);
        const excerptMatch = text.match(/"excerpt"\s*:\s*"([^"]+)"/);
        const contentMatch = text.match(/"content"\s*:\s*"([\s\S]*?)(?:"\s*[,}])/);

        return {
            title: titleMatch?.[1] || 'Untitled',
            excerpt: excerptMatch?.[1] || '',
            content: contentMatch?.[1]?.replace(/\\n/g, '\n').replace(/\\"/g, '"') || text,
        };
    }
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { queue_id, topic, template_id, category } = await req.json();
        console.log('Generate article request:', { queue_id, topic, template_id, category });

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch configs (LLM + Verification) in parallel
        const [llmConfigResult, verConfigResult] = await Promise.all([
            supabase.from('ai_blog_config').select('*').eq('config_type', 'llm_settings').single(),
            supabase.from('ai_blog_config').select('*').eq('config_type', 'verification_config').single()
        ]);

        if (!llmConfigResult.data) {
            throw new Error('LLM settings not configured');
        }

        const llmSettings = llmConfigResult.data.value as {
            provider: 'lovable' | 'openai' | 'anthropic';
            model: string;
            api_key: string | null;
        };

        const verificationSettings = verConfigResult.data?.value as {
            enabled: boolean;
            provider: 'lovable' | 'openai' | 'anthropic';
            model: string;
            prompt: string;
            api_key: string | null;
        } | undefined;

        // Determine Generator API key
        let generatorApiKey: string;
        if (llmSettings.provider === 'lovable') {
            generatorApiKey = Deno.env.get('LOVABLE_API_KEY') || '';
        } else if (llmSettings.api_key) {
            generatorApiKey = llmSettings.api_key;
        } else {
            throw new Error(`API key not configured for provider: ${llmSettings.provider}`);
        }

        // Get source content from queue if queue_id provided
        let sourceTitle = topic || '';
        let sourceContent = '';
        let sourceUrl = '';
        let sourceId = '';
        let targetCategory = category || 'AI Technology';

        // Also fetch prompt_id if linked in queue (Automation Rules)
        let linkedPromptId: string | null = null;

        if (queue_id) {
            const { data: queueData, error: queueError } = await supabase
                .from('ai_blog_queue')
                .select('*')
                .eq('id', queue_id)
                .single();

            if (queueError || !queueData) {
                throw new Error('Queue item not found');
            }

            sourceTitle = queueData.source_title || '';
            sourceContent = queueData.source_content || '';
            sourceUrl = queueData.source_url || '';
            sourceId = queueData.source_id || '';

            // Check Daily Limit for this specific rule (source)
            if (sourceId) {
                const { data: ruleData } = await supabase
                    .from('ai_blog_config')
                    .select('*')
                    .eq('config_type', 'automation_rule')
                    .contains('value', { source_id: sourceId })
                    .single();

                const ruleLimit = (ruleData?.value as any)?.daily_limit;
                if (ruleLimit) {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const { count, error: countError } = await supabase
                        .from('ai_blog_queue')
                        .select('*', { count: 'exact', head: true })
                        .eq('source_id', sourceId)
                        .eq('status', 'completed')
                        .gte('processed_at', today.toISOString());

                    if (!countError && count !== null && count >= ruleLimit) {
                        throw new Error(`Daily limit of ${ruleLimit} articles reached for this pipeline.`);
                    }
                }
            }

            // Check if this queue item has a linked prompt (from Automation Rules)
            if (queueData.prompt_id) {
                linkedPromptId = queueData.prompt_id;
            }

            // Update queue status to processing
            await supabase
                .from('ai_blog_queue')
                .update({ status: 'processing' })
                .eq('id', queue_id);
        }

        // Fetch prompt template
        let promptTemplate = null;
        const targetTemplateId = template_id || linkedPromptId; // Prioritize explicit arg, then queue link, then default

        if (targetTemplateId) {
            const { data: templateData } = await supabase
                .from('ai_blog_config')
                .select('*')
                .eq('id', targetTemplateId)
                .single();
            promptTemplate = templateData;
        } else {
            // Get first active template
            const { data: templates } = await supabase
                .from('ai_blog_config')
                .select('*')
                .eq('config_type', 'prompt_template')
                .eq('is_active', true)
                .limit(1);
            promptTemplate = templates?.[0];
        }

        // Default prompts if no template found
        const defaultSystemPrompt = `You are a professional blog writer and SEO expert for AI Agents 3000, a company that provides AI voice receptionist services. 
Your goal is to write engaging, informative articles that position the company as a thought leader while being perfectly optimized for search engines. 
Use a conversational but professional tone. 
Always include SEO metadata and an FAQ section to improve search visibility.`;

        const defaultUserPrompt = `Write an optimized article about the following topic. 

Topic: {{source_title}}
Category: {{category}}

Requirements:
1. Title: Create a unique, catchy title.
2. Content: Produce an approximately {{target_word_count}} word article in markdown format.
3. SEO Title: An optimized title for search engines (max 60 characters).
4. Meta Description: A compelling meta description that encourages clicks (max 160 characters).
5. SEO Keywords: A list of 5-10 relevant keywords.
6. FAQ Schema: Generate 3-5 frequently asked questions and answers based on the article content.

Source Content (if any):
{{source_content}}

Output MUST be a JSON object with keys: title, excerpt, content, seo_title, meta_description, seo_keywords (array), faq_schema (array of {question, answer} objects).`;

        const templateValue = promptTemplate?.value as {
            system_prompt: string;
            user_prompt: string;
            word_count: number;
        } | undefined;

        const systemPrompt = templateValue?.system_prompt || defaultSystemPrompt;
        const userPrompt = templateValue?.user_prompt || defaultUserPrompt;
        const wordCount = templateValue?.word_count || 800;

        // Replace placeholders
        const placeholders = {
            source_title: sourceTitle,
            source_content: sourceContent.substring(0, 8000), // Limit content length
            source_url: sourceUrl,
            target_word_count: wordCount.toString(),
            category: targetCategory,
            company_name: 'AI Agents 3000',
        };

        const finalUserPrompt = replacePlaceholders(userPrompt, placeholders);

        // 1. Generate Article
        const aiResponse = await callLLM(
            llmSettings.provider,
            llmSettings.model,
            generatorApiKey,
            systemPrompt,
            finalUserPrompt,
            true
        );

        console.log('AI response received, length:', aiResponse.length);

        // Robust JSON parsing
        let articleData: any;
        try {
            articleData = JSON.parse(aiResponse);
        } catch (e) {
            console.warn('Direct JSON parse failed, attempting regex extraction:', e);
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                articleData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Failed to parse AI response as JSON');
            }
        }

        // 2. Verification Step (if enabled)
        let verificationNotes: string | null = null;
        if (verificationSettings?.enabled) {
            console.log('Starting verification step...');
            try {
                // Determine Reviewer API Key
                let reviewerApiKey: string;
                const reviewerProvider = verificationSettings.provider as string;
                if (reviewerProvider === 'lovable') {
                    reviewerApiKey = Deno.env.get('LOVABLE_API_KEY') || '';
                } else if (verificationSettings.api_key) {
                    reviewerApiKey = verificationSettings.api_key;
                } else {
                    // Fallback to generator key if same provider, otherwise error
                    if (verificationSettings.provider === llmSettings.provider) {
                        reviewerApiKey = generatorApiKey;
                    } else {
                        console.warn('No API key for verification provider, using LOVABLE_API_KEY as fallback if lovable');
                        reviewerApiKey = reviewerProvider === 'lovable' ? (Deno.env.get('LOVABLE_API_KEY') || '') : '';
                        if (!reviewerApiKey) throw new Error('No API key for reviewer');
                    }
                }

                const verSystemPrompt = "You are an expert editor and SEO reviewer.";
                const verStats = `Original Topic: ${sourceTitle}\nTarget Category: ${targetCategory}\nSEO Title: ${articleData.seo_title}\nMeta Description: ${articleData.meta_description}\n`;
                const verUserPrompt = `${verificationSettings.prompt || "Review this article for flow, tone, and SEO effectiveness."}\n\n${verStats}\n\nArticle Content:\n${articleData.content}`;

                verificationNotes = await callLLM(
                    verificationSettings.provider,
                    verificationSettings.model,
                    reviewerApiKey,
                    verSystemPrompt,
                    verUserPrompt,
                    false // Not JSON mode, just text
                );
                console.log('Verification completed.');
            } catch (vError) {
                console.error('Verification failed:', vError);
                verificationNotes = `Verification failed: ${vError instanceof Error ? vError.message : 'Unknown error'}`;
            }
        }

        // Generate slug from title
        const slug = articleData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') +
            '-' + Date.now().toString(36);

        // Create blog post as draft
        const { data: blogPost, error: insertError } = await supabase
            .from('blog_posts')
            .insert({
                title: articleData.title,
                slug: slug,
                excerpt: articleData.excerpt || articleData.meta_description || '',
                content: articleData.content,
                category: targetCategory,
                read_time: `${Math.ceil((articleData.content || '').split(/\s+/).length / 200)} min read`,
                author_name: 'AI Content Team',
                source_url: sourceUrl || null,
                status: 'draft',
                verification_notes: verificationNotes,
                seo_title: articleData.seo_title || null,
                meta_description: articleData.meta_description || null,
                seo_keywords: articleData.seo_keywords || null,
                faq_schema: articleData.faq_schema || null,
            })
            .select()
            .single();

        if (insertError) {
            throw new Error(`Failed to create blog post: ${insertError.message}`);
        }

        console.log('Blog post created:', blogPost.id);

        // Update queue item if applicable
        if (queue_id) {
            await supabase
                .from('ai_blog_queue')
                .update({
                    status: 'completed',
                    blog_post_id: blogPost.id,
                    processed_at: new Date().toISOString(),
                })
                .eq('id', queue_id);
        }

        return new Response(
            JSON.stringify({ success: true, post: blogPost }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error in generate-article:', error);

        // Update queue item with error if applicable
        const { queue_id } = await new Response(req.body).json().catch(() => ({}));
        if (queue_id) {
            const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
            const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
            const supabase = createClient(supabaseUrl, supabaseKey);

            await supabase
                .from('ai_blog_queue')
                .update({
                    status: 'failed',
                    error_message: error instanceof Error ? error.message : 'Unknown error',
                })
                .eq('id', queue_id);
        }

        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Article generation failed'
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
