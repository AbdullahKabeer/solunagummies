-- Add landing_page and referrer to sessions table
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS landing_page TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT;
