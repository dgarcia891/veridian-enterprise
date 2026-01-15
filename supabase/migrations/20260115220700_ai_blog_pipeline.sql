-- AI Blog Generation Pipeline Tables
-- Migration: Create ai_blog_config and ai_blog_queue tables

-- Create ai_blog_config table for storing RSS sources, LLM settings, and prompt templates
CREATE TABLE IF NOT EXISTS ai_blog_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_type TEXT NOT NULL CHECK (config_type IN ('rss_source', 'llm_settings', 'prompt_template')),
  name TEXT NOT NULL,
  value JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create ai_blog_queue table for tracking RSS items and generation status
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

-- Create unique index on source_url to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS ai_blog_queue_source_url_idx ON ai_blog_queue(source_url);

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS ai_blog_queue_status_idx ON ai_blog_queue(status);

-- Create index for config lookups by type
CREATE INDEX IF NOT EXISTS ai_blog_config_type_idx ON ai_blog_config(config_type);

-- Enable RLS
ALTER TABLE ai_blog_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_blog_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow authenticated users with admin role to manage
CREATE POLICY "Admins can manage ai_blog_config" ON ai_blog_config
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage ai_blog_queue" ON ai_blog_queue
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'
    )
  );

-- Insert default LLM settings (Lovable AI)
INSERT INTO ai_blog_config (config_type, name, value, is_active)
VALUES (
  'llm_settings',
  'Default LLM',
  '{"provider": "lovable", "model": "google/gemini-2.5-flash", "api_key": null}'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Insert default prompt templates
INSERT INTO ai_blog_config (config_type, name, value, is_active)
VALUES 
  (
    'prompt_template',
    'News Summary',
    '{
      "description": "Rewrite news articles in brand voice",
      "system_prompt": "You are a professional blog writer for AI Agents 3000, a company that provides AI voice receptionist services. Write engaging, informative articles that position the company as a thought leader. Use a conversational but professional tone.",
      "user_prompt": "Rewrite the following article in our brand voice. Create a unique title, write a 2-3 sentence excerpt, and produce a {{target_word_count}}-word article.\n\nSource Title: {{source_title}}\nSource URL: {{source_url}}\nCategory: {{category}}\n\nOriginal Content:\n{{source_content}}\n\nOutput as JSON with keys: title, excerpt, content (markdown format)",
      "word_count": 800
    }'::jsonb,
    true
  ),
  (
    'prompt_template',
    'How-To Guide',
    '{
      "description": "Convert topic into step-by-step tutorial",
      "system_prompt": "You are a technical writer for AI Agents 3000. Create clear, actionable how-to guides that help business owners understand and implement AI solutions. Use numbered steps, include practical examples, and maintain a helpful tone.",
      "user_prompt": "Create a comprehensive how-to guide about the following topic. Target length: {{target_word_count}} words.\n\nTopic: {{source_title}}\nCategory: {{category}}\n\nReference Content (if any):\n{{source_content}}\n\nOutput as JSON with keys: title, excerpt, content (markdown format with numbered steps)",
      "word_count": 1200
    }'::jsonb,
    true
  ),
  (
    'prompt_template',
    'Thought Leadership',
    '{
      "description": "Original opinion piece on industry trends",
      "system_prompt": "You are the founder of AI Agents 3000 writing thought leadership content. Share insights, predictions, and opinions about AI in business. Be confident, forward-thinking, and back up claims with reasoning. Position AI Agents 3000 as innovative leaders in the space.",
      "user_prompt": "Write an original thought leadership article about the following topic. Target length: {{target_word_count}} words. Take a strong position and provide actionable insights.\n\nTopic: {{source_title}}\nCategory: {{category}}\n\nBackground Context:\n{{source_content}}\n\nOutput as JSON with keys: title, excerpt, content (markdown format)",
      "word_count": 1000
    }'::jsonb,
    true
  )
ON CONFLICT DO NOTHING;
