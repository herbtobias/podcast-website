/*
  # Fix admin_users policies
  
  1. Problem
    - The merged policy created a circular reference
    - Users can no longer check their admin status
  
  2. Solution
    - Restore the two separate SELECT policies
    - Keep them separate to avoid circular dependencies
    - The "multiple permissive policies" warning is not a real security issue
  
  3. Changes
    - Drop the broken merged policy
    - Restore "Users can check their own admin status" policy
    - Restore "Admins can view all admin users" policy as SELECT-only
*/

-- Drop the broken merged policy
DROP POLICY IF EXISTS "Users can view admin status" ON admin_users;

-- Restore the two working policies separately
CREATE POLICY "Users can check their own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Admins can view all admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );
