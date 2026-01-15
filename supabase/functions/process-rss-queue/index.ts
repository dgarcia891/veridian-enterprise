import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parseFeed } from "https://deno.land/x/rss@1.0.0/mod.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AutomationRule {
    id: string;
    name: string;
    value: {
        source_id: string;
        prompt_id: string;
        schedule: string;
    };
    is_active: boolean;
}

interface RssSource {
    id: string;
    name: string;
    value: {
        url: string;
        category: string;
    };
    is_active: boolean;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { source_id, auto_generate } = await req.json().catch(() => ({}));
        console.log('Processing RSS queue, source_id:', source_id, 'auto_generate:', auto_generate);

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Fetch Active Rules AND Active Sources
        const [rulesResult, sourcesResult] = await Promise.all([
            supabase.from('ai_blog_config').select('*').eq('config_type', 'automation_rule').eq('is_active', true),
            supabase.from('ai_blog_config').select('*').eq('config_type', 'rss_source').eq('is_active', true)
        ]);

        if (rulesResult.error) throw new Error(`Fetch rules failed: ${rulesResult.error.message}`);
        if (sourcesResult.error) throw new Error(`Fetch sources failed: ${sourcesResult.error.message}`);

        const rules = (rulesResult.data || []) as AutomationRule[];
        const sources = (sourcesResult.data || []) as RssSource[];
        const sourceMap = new Map(sources.map(s => [s.id, s]));

        // Group rules by Source ID to avoid fetching the same feed multiple times
        const uniqueSourceIds = new Set(rules.map(r => r.value.source_id));

        // Also include sources that are active but might not have rules (Legacy support? Or just ignore?)
        // For now, only process sources that have active rules, as requested for "Advanced Scheduling"
        // But if source_id arg is provided, we might want to force it.

        if (rules.length === 0) {
            return new Response(
                JSON.stringify({ success: true, message: 'No active automation rules found', processed: 0 }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        let totalProcessed = 0;
        let totalNew = 0;

        // Iterate over unique sources that have rules
        for (const srcId of uniqueSourceIds) {
            const source = sourceMap.get(srcId);
            if (!source) {
                console.warn(`Rule refers to missing/inactive source: ${srcId}`);
                continue;
            }

            // If specific source_id requested, skip others
            if (source_id && source.id !== source_id) continue;

            const relevantRules = rules.filter(r => r.value.source_id === srcId);
            console.log(`Processing Source: ${source.name}, matches ${relevantRules.length} rules`);

            try {
                // Fetch Feed
                const feedResponse = await fetch(source.value.url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; AIBlogBot/1.0)',
                        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
                    },
                });

                if (!feedResponse.ok) {
                    console.error(`Failed to fetch feed ${source.name}: ${feedResponse.status}`);
                    continue;
                }

                const feedXml = await feedResponse.text();
                const feed = await parseFeed(feedXml);

                for (const entry of feed.entries || []) {
                    const entryUrl = entry.links?.[0]?.href || entry.id || '';
                    if (!entryUrl) continue;

                    // Scrape content ONCE per entry (if needed)
                    // Optimization: Only scrape if we are actually going to insert at least one queue item
                    // But we don't know until we check existence for each rule.

                    let articleContent: string | null = null;
                    let articleTitle = entry.title?.value || '';

                    for (const rule of relevantRules) {
                        // Check existence: URL + Prompt ID
                        const { data: existing } = await supabase
                            .from('ai_blog_queue')
                            .select('id')
                            .eq('source_url', entryUrl)
                            .eq('prompt_id', rule.value.prompt_id)
                            .maybeSingle(); // Use maybeSingle to avoid error if found

                        if (existing) {
                            continue; // Already queued for this rule
                        }

                        // Need to scrape?
                        if (articleContent === null) {
                            // Scrape now
                            try {
                                const scrapeResponse = await fetch(`${supabaseUrl}/functions/v1/scrape-article`, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${supabaseKey}`,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ url: entryUrl }),
                                });

                                if (scrapeResponse.ok) {
                                    const scrapeData = await scrapeResponse.json();
                                    if (scrapeData.success) {
                                        articleContent = scrapeData.content;
                                        articleTitle = scrapeData.title || articleTitle;
                                    }
                                }
                            } catch (scrapeError) {
                                console.error(`Failed to scrape ${entryUrl}:`, scrapeError);
                            }
                            // Fallback
                            if (!articleContent) {
                                articleContent = entry.description?.value || entry.content?.value || '';
                            }
                        }

                        // Insert Queue Item with Prompt ID
                        const { error: insertError } = await supabase
                            .from('ai_blog_queue')
                            .insert({
                                source_id: source.id,
                                prompt_id: rule.value.prompt_id, // Link specific prompt
                                source_url: entryUrl,
                                source_title: articleTitle,
                                source_content: articleContent.substring(0, 50000),
                                status: 'pending',
                            });

                        if (insertError) {
                            console.error(`Failed to insert queue item for ${entryUrl} (Rule: ${rule.name}):`, insertError.message);
                        } else {
                            totalNew++;
                            console.log(`Queued: ${articleTitle.substring(0, 30)}... [${rule.name}]`);
                        }
                    }
                    totalProcessed++;
                }

            } catch (feedError) {
                console.error(`Error processing feed ${source.name}:`, feedError);
            }
        }

        // Auto-generate if requested
        if (auto_generate) {
            const { data: pendingItems } = await supabase
                .from('ai_blog_queue')
                .select('id')
                .eq('status', 'pending')
                .limit(5);

            for (const item of pendingItems || []) {
                // invoke generate-article (fire and forget or await?)
                fetch(`${supabaseUrl}/functions/v1/generate-article`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${supabaseKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ queue_id: item.id }),
                }).catch(e => console.error(`Generation trigger failed for ${item.id}`, e));
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: `Processed rules for ${uniqueSourceIds.size} sources`,
                totalProcessed,
                totalNew,
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error('Error in process-rss-queue:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to process RSS queue'
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
