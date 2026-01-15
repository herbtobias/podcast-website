/*
  # Fix Security and Performance Issues

  1. Indexes
    - Add missing index on admin_users.created_by foreign key

  2. RLS Policy Optimization
    - Update policies to use (select auth.<function>()) for better performance
    - Affects: admin_users, analytics_sessions, analytics_page_views, analytics_events

  3. RLS Policy Restrictions
    - Fix overly permissive policies on episode_transcriptions and episode_links
    - Restrict these tables to admin users only (not all authenticated users)

  4. Important Notes
    - These changes improve query performance at scale
    - Admin-only tables are now properly restricted
    - Analytics tables remain open for INSERT (intentionally, for tracking)
*/

-- 1. Add missing index on foreign key
CREATE INDEX IF NOT EXISTS idx_admin_users_created_by ON admin_users(created_by);

-- 2. Fix admin_users RLS policies for better performance
DROP POLICY IF EXISTS "Users can check their own admin status" ON admin_users;
CREATE POLICY "Users can check their own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING ((select auth.jwt()) ->> 'email' = email);

DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;
CREATE POLICY "Admins can manage admin users"
  ON admin_users
  FOR ALL
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

-- 3. Fix analytics_sessions RLS policies for better performance
DROP POLICY IF EXISTS "Admins can view all sessions" ON analytics_sessions;
CREATE POLICY "Admins can view all sessions"
  ON analytics_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  );

-- 4. Fix analytics_page_views RLS policies for better performance
DROP POLICY IF EXISTS "Admins can view all page views" ON analytics_page_views;
CREATE POLICY "Admins can view all page views"
  ON analytics_page_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  );

-- 5. Fix analytics_events RLS policies for better performance
DROP POLICY IF EXISTS "Admins can view all events" ON analytics_events;
CREATE POLICY "Admins can view all events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  );

-- 6. Fix episode_transcriptions policies - restrict to admins only
DROP POLICY IF EXISTS "Authenticated users can insert transcriptions" ON episode_transcriptions;
DROP POLICY IF EXISTS "Authenticated users can update transcriptions" ON episode_transcriptions;
DROP POLICY IF EXISTS "Authenticated users can delete transcriptions" ON episode_transcriptions;

CREATE POLICY "Admins can insert transcriptions"
  ON episode_transcriptions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  );

CREATE POLICY "Admins can update transcriptions"
  ON episode_transcriptions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  );

CREATE POLICY "Admins can delete transcriptions"
  ON episode_transcriptions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  );

-- 7. Fix episode_links policies - restrict to admins only
DROP POLICY IF EXISTS "Authenticated users can insert links" ON episode_links;
DROP POLICY IF EXISTS "Authenticated users can update links" ON episode_links;
DROP POLICY IF EXISTS "Authenticated users can delete links" ON episode_links;

CREATE POLICY "Admins can insert links"
  ON episode_links FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  );

CREATE POLICY "Admins can update links"
  ON episode_links FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  );

CREATE POLICY "Admins can delete links"
  ON episode_links FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  );

-- 8. Fix rss_feed_cache policies - restrict to admins only
DROP POLICY IF EXISTS "Authenticated users can insert feed cache" ON rss_feed_cache;
DROP POLICY IF EXISTS "Authenticated users can update feed cache" ON rss_feed_cache;

CREATE POLICY "Admins can insert feed cache"
  ON rss_feed_cache FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  );

CREATE POLICY "Admins can update feed cache"
  ON rss_feed_cache FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (select auth.jwt()) ->> 'email'
    )
  );