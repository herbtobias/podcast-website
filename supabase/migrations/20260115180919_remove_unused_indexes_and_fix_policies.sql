/*
  # Remove Unused Indexes and Fix Policy Conflicts

  1. Remove Unused Indexes
    - Drop indexes that are not being used to reduce overhead
    - Includes indexes on: newsletter_subscriptions, episode_links, rss_feed_cache, 
      analytics tables, episodes, and admin_users

  2. Fix Multiple Permissive Policies
    - Consolidate admin_users SELECT policies to avoid conflicts
    - Combine "Users can check their own admin status" and "Admins can manage admin users"

  3. Notes on RLS "Always True" Warnings
    - Analytics tables (sessions, page_views, events): Allow public INSERT by design for tracking
    - Newsletter subscriptions: Allow public INSERT by design for signups
    - These are intentional and not security issues
*/

-- 1. Drop unused indexes
DROP INDEX IF EXISTS idx_newsletter_email;
DROP INDEX IF EXISTS idx_episode_links_display_order;
DROP INDEX IF EXISTS idx_rss_feed_cache_feed_url;
DROP INDEX IF EXISTS idx_rss_feed_cache_last_fetched;
DROP INDEX IF EXISTS idx_sessions_session_id;
DROP INDEX IF EXISTS idx_sessions_created_at;
DROP INDEX IF EXISTS idx_page_views_session_id;
DROP INDEX IF EXISTS idx_page_views_created_at;
DROP INDEX IF EXISTS idx_page_views_page_path;
DROP INDEX IF EXISTS idx_events_session_id;
DROP INDEX IF EXISTS idx_events_created_at;
DROP INDEX IF EXISTS idx_events_event_type;
DROP INDEX IF EXISTS idx_episodes_audio_url;
DROP INDEX IF EXISTS idx_admin_users_created_by;

-- 2. Fix multiple permissive policies on admin_users
-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Users can check their own admin status" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

-- Create a single consolidated SELECT policy
CREATE POLICY "Users can view admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    -- Users can check if they are admin OR admins can view all
    email = (select auth.jwt()) ->> 'email'
    OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (select auth.jwt()) ->> 'email'
    )
  );

-- Recreate other admin policies for INSERT, UPDATE, DELETE
CREATE POLICY "Admins can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (select auth.jwt()) ->> 'email'
    )
  );

CREATE POLICY "Admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (select auth.jwt()) ->> 'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (select auth.jwt()) ->> 'email'
    )
  );

CREATE POLICY "Admins can delete admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (select auth.jwt()) ->> 'email'
    )
  );