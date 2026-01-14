-- Add new columns to ai_audit_submissions for enhanced form data
ALTER TABLE ai_audit_submissions 
ADD COLUMN IF NOT EXISTS total_customers_per_month INTEGER,
ADD COLUMN IF NOT EXISTS customer_source_split JSONB,
ADD COLUMN IF NOT EXISTS website_knowledge TEXT CHECK (website_knowledge IN ('exactly', 'kind-of', 'no-idea')),
ADD COLUMN IF NOT EXISTS text_preference INTEGER,
ADD COLUMN IF NOT EXISTS phone_preference INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN ai_audit_submissions.total_customers_per_month IS 'Total new customers per month (user input)';
COMMENT ON COLUMN ai_audit_submissions.customer_source_split IS 'JSON object with website, phone, other percentages';
COMMENT ON COLUMN ai_audit_submissions.website_knowledge IS 'User knowledge level of website metrics: exactly, kind-of, or no-idea';
COMMENT ON COLUMN ai_audit_submissions.text_preference IS 'Percentage of customers who prefer text/chat communication (0-100)';
COMMENT ON COLUMN ai_audit_submissions.phone_preference IS 'Percentage of customers who prefer phone communication (0-100)';
