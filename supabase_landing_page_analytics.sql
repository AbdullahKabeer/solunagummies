-- View for Landing Page Stats
CREATE OR REPLACE VIEW landing_page_stats AS
SELECT 
  s.landing_page,
  COUNT(DISTINCT s.id) AS sessions_count,
  COUNT(DISTINCT o.id) AS orders_count,
  CASE 
    WHEN COUNT(DISTINCT s.id) > 0 THEN 
      ROUND((COUNT(DISTINCT o.id)::numeric / COUNT(DISTINCT s.id)::numeric) * 100, 2)
    ELSE 0 
  END AS conversion_rate
FROM sessions s
LEFT JOIN orders o ON s.id = o.session_id
WHERE s.landing_page IS NOT NULL
GROUP BY s.landing_page
ORDER BY sessions_count DESC;

-- View for Referrer Stats
CREATE OR REPLACE VIEW referrer_stats AS
SELECT 
  s.referrer,
  COUNT(DISTINCT s.id) AS sessions_count,
  COUNT(DISTINCT o.id) AS orders_count,
  CASE 
    WHEN COUNT(DISTINCT s.id) > 0 THEN 
      ROUND((COUNT(DISTINCT o.id)::numeric / COUNT(DISTINCT s.id)::numeric) * 100, 2)
    ELSE 0 
  END AS conversion_rate
FROM sessions s
LEFT JOIN orders o ON s.id = o.session_id
WHERE s.referrer IS NOT NULL
GROUP BY s.referrer
ORDER BY sessions_count DESC;

-- View for Campaign Stats (UTM)
CREATE OR REPLACE VIEW campaign_stats AS
SELECT 
  s.utm_source,
  s.utm_medium,
  s.utm_campaign,
  COUNT(DISTINCT s.id) AS sessions_count,
  COUNT(DISTINCT o.id) AS orders_count,
  CASE 
    WHEN COUNT(DISTINCT s.id) > 0 THEN 
      ROUND((COUNT(DISTINCT o.id)::numeric / COUNT(DISTINCT s.id)::numeric) * 100, 2)
    ELSE 0 
  END AS conversion_rate
FROM sessions s
LEFT JOIN orders o ON s.id = o.session_id
WHERE s.utm_source IS NOT NULL OR s.utm_campaign IS NOT NULL
GROUP BY s.utm_source, s.utm_medium, s.utm_campaign
ORDER BY sessions_count DESC;
