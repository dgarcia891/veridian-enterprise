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
        const defaultSystemPrompt = `You are a professional blog writer for AI Agents 3000, a company that provides AI voice receptionist services. Write engaging, informative articles that position the company as a thought leader. Use a conversational but professional tone.}`;

        const defaultUserPrompt = `Write an article about the following topic. Create a unique title, write a 2-3 sentence excerpt, and produce an 800-word article.

Topic: {{source_title}}
Category: {{category}}

Source Content (if any):
{{source_content}}

Output as JSON with keys: title, excerpt, content (markdown format)`;

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
        const articleData = parseJsonResponse(aiResponse);

        // 2. Verification Step (if enabled)
        let verificationNotes: string | null = null;
        if (verificationSettings?.enabled) {
            console.log('Starting verification step...');
            try {
                // Determine Reviewer API Key
                let reviewerApiKey: string;
                if (verificationSettings.provider === 'lovable') {
                    reviewerApiKey = Deno.env.get('LOVABLE_API_KEY') || '';
                } else if (verificationSettings.api_key) {
                    reviewerApiKey = verificationSettings.api_key;
                } else {
                    // Fallback to generator key if same provider, otherwise error
                    if (verificationSettings.provider === llmSettings.provider) {
                        reviewerApiKey = generatorApiKey;
                    } else {
                        console.warn('No API key for verification provider, using LOVABLE_API_KEY as fallback if lovable');
                        reviewerApiKey = verificationSettings.provider === 'lovable' ? (Deno.env.get('LOVABLE_API_KEY') || '') : '';
                        if (!reviewerApiKey) throw new Error('No API key for reviewer');
                    }
                }

                const verSystemPrompt = "You are an expert editor.";
                const verStats = `Original Topic: ${sourceTitle}\nTarget Category: ${targetCategory}\n`;
                const verUserPrompt = `${verificationSettings.prompt || "Review this article."}\n\n${verStats}\n\nArticle Content:\n${articleData.content}`;

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
                excerpt: articleData.excerpt,
                content: articleData.content,
                category: targetCategory,
                read_time: `${Math.ceil(articleData.content.split(/\s+/).length / 200)} min read`,
                author_name: 'AI Content Team',
                source_url: sourceUrl || null,
                status: 'draft',
                verification_notes: verificationNotes, // Save notes
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
