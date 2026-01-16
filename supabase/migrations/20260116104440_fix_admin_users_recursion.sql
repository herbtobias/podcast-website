/*
  # Fix Infinite Recursion in admin_users Policies

  The previous policies caused infinite recursion by querying admin_users
  within admin_users policies. This fix uses a security definer function
  to break the recursion.

  1. Create a security definer function to check admin status
  2. Update all admin_users policies to use this function
*/

-- Create a security definer function that bypasses RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = ((select auth.jwt()) ->> 'email')
  );
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can check admin status or admins view all" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can delete admin users" ON admin_users;

-- Create new policies using the function
CREATE POLICY "Users can check own or admins view all"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    email = ((select auth.jwt()) ->> 'email')
    OR is_admin()
  );

CREATE POLICY "Admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete admin users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (is_admin());

-- Also update analytics policies to use the function
DROP POLICY IF EXISTS "Admins can view all sessions" ON analytics_sessions;
DROP POLICY IF EXISTS "Admins can view all page views" ON analytics_page_views;
DROP POLICY IF EXISTS "Admins can view all events" ON analytics_events;

CREATE POLICY "Admins can view all sessions"
  ON analytics_sessions FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can view all page views"
  ON analytics_page_views FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can view all events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (is_admin());
