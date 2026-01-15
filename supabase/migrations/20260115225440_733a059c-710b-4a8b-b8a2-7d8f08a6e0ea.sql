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

-- Create policies using existing has_role function to avoid recursion
CREATE POLICY "Admins can manage ai_blog_config" ON ai_blog_config
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage ai_blog_queue" ON ai_blog_queue
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default configuration: LLM Settings (Lovable Defaults)
INSERT INTO ai_blog_config (config_type, name, value, is_active)
VALUES ('llm_settings', 'Default LLM', '{"provider": "lovable", "model": "google/gemini-2.5-flash", "api_key": null}'::jsonb, true);

-- Insert default configuration: Prompt Templates
INSERT INTO ai_blog_config (config_type, name, value, is_active)
VALUES 
  ('prompt_template', 'News Summary', '{"description": "Rewrite news articles in brand voice", "system_prompt": "You are a professional blog writer for AI Agents 3000. Write engaging, informative articles.", "user_prompt": "Rewrite this article in our brand voice. Output as JSON with keys: title, excerpt, content\n\nSource: {{source_title}}\n\n{{source_content}}", "word_count": 800}'::jsonb, true),
  ('prompt_template', 'How-To Guide', '{"description": "Step-by-step tutorial", "system_prompt": "You are a technical writer. Create clear, actionable how-to guides.", "user_prompt": "Create a how-to guide about: {{source_title}}\n\nOutput as JSON with keys: title, excerpt, content", "word_count": 1200}'::jsonb, true);