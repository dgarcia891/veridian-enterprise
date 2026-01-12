-- Create table for AI audit submissions
CREATE TABLE ai_audit_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  missed_calls_per_week INTEGER NOT NULL,
  avg_profit_per_customer NUMERIC NOT NULL,
  current_call_method TEXT NOT NULL,
  daily_loss NUMERIC NOT NULL,
  monthly_loss NUMERIC NOT NULL,
  annual_loss NUMERIC NOT NULL,
  ai_readiness_score INTEGER NOT NULL,
  score_tier TEXT NOT NULL,
  recommended_solutions TEXT[] NOT NULL,
  ghl_sent BOOLEAN DEFAULT false,
  ghl_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_ai_audit_email ON ai_audit_submissions(email);
CREATE INDEX idx_ai_audit_created ON ai_audit_submissions(created_at);

-- Enable RLS
ALTER TABLE ai_audit_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can submit an audit)
CREATE POLICY "Anyone can submit AI audits"
ON ai_audit_submissions
FOR INSERT
TO public
WITH CHECK (true);