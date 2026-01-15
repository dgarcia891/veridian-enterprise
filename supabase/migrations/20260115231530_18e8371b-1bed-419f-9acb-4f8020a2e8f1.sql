-- AI Blog Pipeline V2: Advanced Scheduling & Verification

-- 1. Extend config_type check constraint
ALTER TABLE ai_blog_config DROP CONSTRAINT IF EXISTS ai_blog_config_config_type_check;
ALTER TABLE ai_blog_config ADD CONSTRAINT ai_blog_config_config_type_check 
  CHECK (config_type IN ('rss_source', 'llm_settings', 'prompt_template', 'automation_rule', 'verification_config'));

-- 2. Add verification_notes to blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- 3. Add prompt_id to ai_blog_queue for tracking rules
ALTER TABLE ai_blog_queue ADD COLUMN IF NOT EXISTS prompt_id UUID REFERENCES ai_blog_config(id);

-- 4. Insert default Verification Config (Disabled by default)
INSERT INTO ai_blog_config (config_type, name, value, is_active)
VALUES ('verification_config', 'Reviewer LLM', 
  '{"enabled": false, "provider": "openai", "model": "gpt-4", "prompt": "You are a senior editor. Review the following blog post for accuracy, tone, and grammar. Provide a bulleted list of feedback."}'::jsonb, 
  true
);