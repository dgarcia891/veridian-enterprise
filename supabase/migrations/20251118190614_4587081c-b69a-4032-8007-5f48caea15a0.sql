-- Create table for storing qualification form submissions
CREATE TABLE IF NOT EXISTS public.qualification_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Business Details
  company_name TEXT NOT NULL,
  location TEXT,
  services TEXT,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  employee_count TEXT,
  
  -- Lead Qualification
  inbound_calls_per_day INTEGER DEFAULT 0,
  missed_calls_per_day INTEGER DEFAULT 0,
  current_call_method TEXT,
  pain_points TEXT,
  
  -- Financial Details
  avg_project_value DECIMAL(10,2) DEFAULT 0,
  new_clients_per_month INTEGER DEFAULT 0,
  customer_acquisition_cost DECIMAL(10,2) DEFAULT 0,
  lifetime_value DECIMAL(10,2) DEFAULT 0,
  
  -- Calculated ROI Metrics (stored for historical tracking)
  daily_lost_revenue DECIMAL(10,2),
  monthly_lost_revenue DECIMAL(10,2),
  annual_lost_revenue DECIMAL(10,2),
  monthly_recovered_revenue DECIMAL(10,2),
  annual_recovered_revenue DECIMAL(10,2),
  monthly_net_gain DECIMAL(10,2),
  annual_net_gain DECIMAL(10,2),
  roi_percentage DECIMAL(5,2),
  is_qualified BOOLEAN DEFAULT false,
  is_high_value BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by_email TEXT,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.qualification_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (internal tool)
CREATE POLICY "Anyone can submit qualifications"
  ON public.qualification_submissions
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow reads from anyone (internal tool)
CREATE POLICY "Anyone can view qualifications"
  ON public.qualification_submissions
  FOR SELECT
  USING (true);

-- Create policy to allow updates from anyone (internal tool)
CREATE POLICY "Anyone can update qualifications"
  ON public.qualification_submissions
  FOR UPDATE
  USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_qualification_submissions_updated_at
  BEFORE UPDATE ON public.qualification_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_qualification_submissions_created_at 
  ON public.qualification_submissions(created_at DESC);

CREATE INDEX idx_qualification_submissions_company 
  ON public.qualification_submissions(company_name);

CREATE INDEX idx_qualification_submissions_qualified 
  ON public.qualification_submissions(is_qualified, is_high_value);