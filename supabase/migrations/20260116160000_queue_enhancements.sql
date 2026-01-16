-- Add 'global_settings' to config_type check constraint
ALTER TABLE ai_blog_config DROP CONSTRAINT IF EXISTS ai_blog_config_config_type_check;
ALTER TABLE ai_blog_config ADD CONSTRAINT ai_blog_config_config_type_check 
  CHECK (config_type IN ('rss_source', 'llm_settings', 'prompt_template', 'automation_rule', 'verification_config', 'global_settings'));

-- Add 'published' and 'rejected' to ai_blog_queue status check constraint
ALTER TABLE ai_blog_queue DROP CONSTRAINT IF EXISTS ai_blog_queue_status_check;
ALTER TABLE ai_blog_queue ADD CONSTRAINT ai_blog_queue_status_check 
  CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'skipped', 'published', 'rejected'));

-- Insert default global settings if not exists
INSERT INTO ai_blog_config (config_type, name, value, is_active)
SELECT 'global_settings', 'Daily Generation Limit', '{"daily_limit": 50}'::jsonb, true
WHERE NOT EXISTS (
    SELECT 1 FROM ai_blog_config WHERE config_type = 'global_settings'
);
