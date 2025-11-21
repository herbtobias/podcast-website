/*
  # Fix admin_users RLS policies
  
  ## Problem
  The "Admins can manage admin users" policy causes infinite recursion because it queries
  the same table it's protecting while checking permissions.
  
  ## Solution
  - Drop the problematic policy
  - Keep the simple SELECT policy that allows users to check their own admin status
  - For admin management (INSERT/UPDATE/DELETE), we'll handle permissions at the application level
    or use service role key for initial setup
  
  ## Changes
  1. Drop the recursive policy
  2. The SELECT policy remains unchanged and works correctly
  
  ## Security Notes
  - Users can only SELECT their own email from admin_users (no security risk)
  - Admin management operations should be done via Supabase dashboard or service role
  - This prevents the infinite recursion issue while maintaining security
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

-- The SELECT policy is fine and doesn't cause recursion
-- It only allows users to check if their own email exists in the table
-- No changes needed to this policy:
-- CREATE POLICY "Users can check their own admin status"
--   ON admin_users FOR SELECT TO authenticated
--   USING (auth.jwt() ->> 'email' = email);
