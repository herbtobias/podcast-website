/*
  # Create admin users table

  ## Overview
  This migration creates a table to store authorized admin user emails.
  Only users with emails in this table can access admin functionality.

  ## New Tables
    - `admin_users`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text, not null, unique) - Admin user email address
      - `created_at` (timestamptz) - When the admin was added
      - `created_by` (uuid) - Who created this admin entry

  ## Security
    - Enable RLS on `admin_users` table
    - Add policy for authenticated users to read their own admin status
    - Restrict insert/update/delete to existing admins only

  ## Notes
    - Emails must be unique
    - This table controls access to admin features
    - Initial admin must be added manually via SQL or Supabase dashboard
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can check their own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);