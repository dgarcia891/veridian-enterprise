-- Add new columns to ai_audit_submissions table
ALTER TABLE ai_audit_submissions 
ADD COLUMN website_visits_per_month integer,
ADD COLUMN clients_per_month integer NOT NULL DEFAULT 0;