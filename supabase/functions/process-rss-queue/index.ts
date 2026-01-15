import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { parseFeed } from "https://deno.land/x/rss@1.0.0/mod.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RssSource {
    id: string;
    name: string;
    value: {
        url: string;
        category: string;
        schedule: string;
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

        // Fetch active RSS sources
        let query = supabase
            .from('ai_blog_config')
            .select('*')
            .eq('config_type', 'rss_source')
            .eq('is_active', true);

        if (source_id) {
            query = query.eq('id', source_id);
        }

        const { data: sources, error: sourcesError } = await query;

        if (sourcesError) {
            throw new Error(`Failed to fetch RSS sources: ${sourcesError.message}`);
        }

        if (!sources || sources.length === 0) {
            return new Response(
                JSON.stringify({ success: true, message: 'No active RSS sources found', processed: 0 }),
                { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        let totalProcessed = 0;
        let totalNew = 0;

        for (const source of sources as RssSource[]) {
            console.log(`Processing RSS source: ${source.name} (${source.value.url})`);

            try {
                // Fetch and parse the RSS feed
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

                console.log(`Parsed ${feed.entries?.length || 0} entries from ${source.name}`);

                for (const entry of feed.entries || []) {
                    const entryUrl = entry.links?.[0]?.href || entry.id || '';
                    if (!entryUrl) continue;

                    // Check if this URL is already in the queue
                    const { data: existing } = await supabase
                        .from('ai_blog_queue')
                        .select('id')
                        .eq('source_url', entryUrl)
                        .single();

                    if (existing) {
                        continue; // Already processed
                    }

                    // Scrape the full article content
                    let articleContent = '';
                    let articleTitle = entry.title?.value || '';

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
                        // Use feed description as fallback
                        articleContent = entry.description?.value || entry.content?.value || '';
                    }

                    // Insert into queue
                    const { error: insertError } = await supabase
                        .from('ai_blog_queue')
                        .insert({
                            source_id: source.id,
                            source_url: entryUrl,
                            source_title: articleTitle,
                            source_content: articleContent.substring(0, 50000), // Limit content size
                            status: 'pending',
                        });

                    if (insertError) {
                        console.error(`Failed to insert queue item for ${entryUrl}:`, insertError.message);
                    } else {
                        totalNew++;
                        console.log(`Queued: ${articleTitle.substring(0, 50)}...`);
                    }

                    totalProcessed++;
                }
            } catch (feedError) {
                console.error(`Error processing feed ${source.name}:`, feedError);
            }
        }

        // Optionally auto-generate articles for pending items
        if (auto_generate) {
            const { data: pendingItems } = await supabase
                .from('ai_blog_queue')
                .select('id')
                .eq('status', 'pending')
                .limit(5); // Process up to 5 at a time

            for (const item of pendingItems || []) {
                try {
                    await fetch(`${supabaseUrl}/functions/v1/generate-article`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${supabaseKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ queue_id: item.id }),
                    });
                } catch (genError) {
                    console.error(`Failed to generate article for ${item.id}:`, genError);
                }
            }
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: `Processed ${sources.length} RSS sources`,
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
