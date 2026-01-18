# AI Blog Pipeline Deployment Instructions

## 1. Database Migration

Run the following SQL in the **Supabase SQL Editor** to create the necessary tables and policies.

```sql
-- Create configuration table for RSS sources, LLM settings, and prompt templates
CREATE TABLE IF NOT EXISTS ai_blog_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_type TEXT NOT NULL CHECK (config_type IN ('rss_source', 'llm_settings', 'prompt_template')),
  name TEXT NOT NULL,
  value JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create queue table for managing article generation
CREATE TABLE IF NOT EXISTS ai_blog_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES ai_blog_config(id) ON DELETE SET NULL,
  source_url TEXT NOT NULL,
  source_title TEXT,
  source_content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'skipped')),
  blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Add indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS ai_blog_queue_source_url_idx ON ai_blog_queue(source_url);
CREATE INDEX IF NOT EXISTS ai_blog_queue_status_idx ON ai_blog_queue(status);
CREATE INDEX IF NOT EXISTS ai_blog_config_type_idx ON ai_blog_config(config_type);

-- Enable Row Level Security (RLS)
ALTER TABLE ai_blog_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_blog_queue ENABLE ROW LEVEL SECURITY;

-- Create policies (Admin only access)
CREATE POLICY "Admins can manage ai_blog_config" ON ai_blog_config
  FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE POLICY "Admins can manage ai_blog_queue" ON ai_blog_queue
  FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

-- Insert default configuration: LLM Settings (Lovable Defaults)
INSERT INTO ai_blog_config (config_type, name, value, is_active)
VALUES ('llm_settings', 'Default LLM', '{"provider": "lovable", "model": "google/gemini-2.5-flash", "api_key": null}'::jsonb, true);

-- Insert default configuration: Prompt Templates
INSERT INTO ai_blog_config (config_type, name, value, is_active)
VALUES 
  ('prompt_template', 'News Summary', '{"description": "Rewrite news articles in brand voice", "system_prompt": "You are a professional blog writer for AI Agents 3000. Write engaging, informative articles.", "user_prompt": "Rewrite this article in our brand voice. Output as JSON with keys: title, excerpt, content\\n\\nSource: {{source_title}}\\n\\n{{source_content}}", "word_count": 800}'::jsonb, true),
  ('prompt_template', 'How-To Guide', '{"description": "Step-by-step tutorial", "system_prompt": "You are a technical writer. Create clear, actionable how-to guides.", "user_prompt": "Create a how-to guide about: {{source_title}}\\n\\nOutput as JSON with keys: title, excerpt, content", "word_count": 1200}'::jsonb, true);
```

## 2. Deploy Edge Functions

In the Lovable interface:

1. Navigate to **Edge Functions**.
2. Ensure the following functions are detected:
    * `generate-article`
    * `scrape-article`
    * `process-rss-queue`
3. Click **Deploy** (or Publish) to push these functions to Supabase.

## 3. Environment Variables

* **`LOVABLE_API_KEY`**: This is automatically handled by Lovable for the `generate-article` function when using the "Lovable AI" provider.
* **OpenAI / Anthropic Keys**: These do **not** need to be set as environment variables. You can enter them securely in the **Admin > AI Configuration** UI, and they will be stored in the database.

## 4. Cron Job (Optional Automation)

To automatically check RSS feeds every hour, run this SQL:

```sql
select
  cron.schedule(
    'process-rss-feeds',
    '0 * * * *', -- Every hour
    $$
    select
      net.http_post(
          url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/process-rss-queue',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
          body:='{"auto_generate": true}'::jsonb
      ) as request_id;
    $$
  );
```

*Note: You will need to replace `YOUR_PROJECT_REF` and `YOUR_SERVICE_ROLE_KEY` with your actual Supabase project details if you set this up manually.*

## 5. Verify Installation

1. Go to your app's **Admin Dashboard**.
2. Navigate to **Blog**.
3. Click the new **AI Content** button.
4. Add an RSS Source (e.g., `https://techcrunch.com/feed/`) and click **Save**.
5. Check the **Queue** tab to see if items appear.
