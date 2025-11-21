-- Add new tracking columns for roofing entry path
ALTER TABLE ai_audit_submissions
ADD COLUMN IF NOT EXISTS entry_path VARCHAR(50) DEFAULT 'comprehensive',
ADD COLUMN IF NOT EXISTS completed_full_audit BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS quick_result_shown BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS utm_source VARCHAR(255),
ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(255),
ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(255);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_entry_path ON ai_audit_submissions(entry_path);
CREATE INDEX IF NOT EXISTS idx_utm_source ON ai_audit_submissions(utm_source);
CREATE INDEX IF NOT EXISTS idx_completed_full_audit ON ai_audit_submissions(completed_full_audit);