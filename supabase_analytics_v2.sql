-- 1. Enhance Orders Table for Financial Reporting
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS subtotal_price NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_tax NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_shipping NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_discounts NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_code TEXT,
ADD COLUMN IF NOT EXISTS landing_site TEXT;

-- 2. Enhance Order Items for Profit & Inventory
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS cost_per_item NUMERIC(10,2) DEFAULT 0, -- COGS
ADD COLUMN IF NOT EXISTS sku TEXT;

-- 3. Enhance Sessions Table for Traffic & Retention
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS browser TEXT,
ADD COLUMN IF NOT EXISTS visitor_id UUID; -- Long-lived cookie ID

-- Note: utm_source, utm_medium, utm_campaign, device_type were added in previous step, 
-- but we will ensure they are populated correctly via middleware/API.

-- 4. Ensure Analytics Events has proper indexing
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
ALTER TABLE analytics_events ALTER COLUMN session_id SET NOT NULL;
