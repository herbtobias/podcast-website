/*
  # Setup RSS Feed Cron Job

  ## Overview
  This migration enables the pg_cron extension and sets up a daily scheduled job
  to automatically fetch and sync podcast episodes from the RSS feed. The cron job
  calls the sync-rss-feed Edge Function every day at 6:00 AM UTC.

  ## Changes
    1. Enable pg_cron extension for scheduled tasks
    2. Create scheduled job to run RSS sync daily
    3. Add helper function to trigger Edge Function from database

  ## Security
    - Cron jobs run with superuser privileges
    - Edge Function URL is constructed from environment

  ## Notes
    - The cron job runs at 6:00 AM UTC every day
    - If the Edge Function fails, it will be retried the next day
    - Sync logs in rss_sync_log table provide audit trail
    - To manually trigger sync, call the Edge Function endpoint directly
    - To disable automatic sync, use: SELECT cron.unschedule('daily-rss-sync')
    - To re-enable: Use the schedule command below again
*/

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to call the Edge Function
-- Note: This is a placeholder. The actual HTTP call needs to be configured
-- through Supabase dashboard or using pg_net extension when available

-- Schedule daily RSS feed sync at 6:00 AM UTC
-- Using pg_cron to trigger the sync-rss-feed Edge Function
SELECT cron.schedule(
  'daily-rss-sync',
  '0 6 * * *',
  $$
  SELECT
    net.http_post(
      url:=current_setting('app.settings.supabase_url') || '/functions/v1/sync-rss-feed',
      headers:=jsonb_build_object(
        'Content-Type','application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.supabase_anon_key')
      ),
      body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Note: The above cron job requires the net extension and proper configuration
-- For immediate setup, you can use an external cron service or workflow automation
-- to call the Edge Function URL daily:
-- POST https://[your-project].supabase.co/functions/v1/sync-rss-feed