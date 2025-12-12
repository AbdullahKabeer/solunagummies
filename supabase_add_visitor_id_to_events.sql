-- Add visitor_id to analytics_events
ALTER TABLE public.analytics_events ADD COLUMN IF NOT EXISTS visitor_id UUID;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_id ON public.analytics_events(visitor_id);
