/*
  # Fix RLS Performance and Security Issues

  1. Indexes
    - Add index on admin_users.created_by for foreign key performance

  2. RLS Policy Optimizations
    - Wrap auth.jwt() calls with (select ...) for better query performance
    - Consolidate multiple SELECT policies on admin_users into one

  3. Security Improvements
    - Add basic validation to analytics and newsletter INSERT policies
    - Remove always-true policies and add proper checks
*/

-- Add index for foreign key on admin_users.created_by
CREATE INDEX IF NOT EXISTS idx_admin_users_created_by ON admin_users(created_by);

-- Drop existing policies on admin_users to recreate them optimized
DROP POLICY IF EXISTS "Users can check their own admin status" ON admin_users;
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can delete admin users" ON admin_users;

-- Create optimized combined SELECT policy
CREATE POLICY "Users can check admin status or admins view all"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    email = ((select auth.jwt()) ->> 'email')
    OR EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = ((select auth.jwt()) ->> 'email')
    )
  );

-- Create optimized INSERT policy
CREATE POLICY "Admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = ((select auth.jwt()) ->> 'email')
    )
  );

-- Create optimized UPDATE policy
CREATE POLICY "Admins can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = ((select auth.jwt()) ->> 'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = ((select auth.jwt()) ->> 'email')
    )
  );

-- Create optimized DELETE policy
CREATE POLICY "Admins can delete admin users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.email = ((select auth.jwt()) ->> 'email')
    )
  );

-- Fix analytics_events INSERT policy
DROP POLICY IF EXISTS "Anyone can insert events" ON analytics_events;
CREATE POLICY "Anyone can insert events with valid data"
  ON analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    event_type IS NOT NULL 
    AND length(event_type) > 0 
    AND length(event_type) <= 100
  );

-- Fix analytics_page_views INSERT policy
DROP POLICY IF EXISTS "Anyone can insert page views" ON analytics_page_views;
CREATE POLICY "Anyone can insert page views with valid data"
  ON analytics_page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    page_path IS NOT NULL 
    AND length(page_path) > 0 
    AND length(page_path) <= 500
  );

-- Fix analytics_sessions INSERT policy
DROP POLICY IF EXISTS "Anyone can insert their own session data" ON analytics_sessions;
CREATE POLICY "Anyone can insert session with valid data"
  ON analytics_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    session_id IS NOT NULL 
    AND length(session_id) > 0 
    AND length(session_id) <= 100
  );

-- Fix newsletter_subscriptions INSERT policy
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscriptions;
CREATE POLICY "Anyone can subscribe with valid email"
  ON newsletter_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL 
    AND length(email) >= 5 
    AND length(email) <= 255
    AND email ~ '^[^@]+@[^@]+\.[^@]+$'
  );

-- Also optimize the SELECT policies on analytics tables
DROP POLICY IF EXISTS "Admins can view all sessions" ON analytics_sessions;
DROP POLICY IF EXISTS "Admins can view all page views" ON analytics_page_views;
DROP POLICY IF EXISTS "Admins can view all events" ON analytics_events;

CREATE POLICY "Admins can view all sessions"
  ON analytics_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
    )
  );

CREATE POLICY "Admins can view all page views"
  ON analytics_page_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
    )
  );

CREATE POLICY "Admins can view all events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = ((select auth.jwt()) ->> 'email')
    )
  );
