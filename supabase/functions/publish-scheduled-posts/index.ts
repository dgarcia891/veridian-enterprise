import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find posts that are scheduled and due
    const { data: duePosts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString());

    if (fetchError) {
      console.error('Error fetching scheduled posts:', fetchError);
      throw fetchError;
    }

    if (!duePosts || duePosts.length === 0) {
      console.log('No scheduled posts to publish');
      return new Response(
        JSON.stringify({ success: true, published: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${duePosts.length} scheduled post(s) to publish`);

    const ids = duePosts.map(p => p.id);

    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .in('id', ids);

    if (updateError) {
      console.error('Error publishing scheduled posts:', updateError);
      throw updateError;
    }

    const titles = duePosts.map(p => p.title);
    console.log('Published posts:', titles);

    return new Response(
      JSON.stringify({ success: true, published: duePosts.length, posts: titles }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in publish-scheduled-posts:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
