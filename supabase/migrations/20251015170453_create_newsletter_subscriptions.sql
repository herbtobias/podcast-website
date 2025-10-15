/*
  # Newsletter Subscriptions Table

  1. New Tables
    - `newsletter_subscriptions`
      - `id` (uuid, primary key) - Unique identifier for each subscription
      - `email` (text, unique, not null) - Email address of the subscriber
      - `created_at` (timestamptz) - Timestamp when the subscription was created
  
  2. Security
    - Enable RLS on `newsletter_subscriptions` table
    - Add policy for anonymous users to insert their email address
    - Add policy for service role to read all subscriptions (for admin purposes)
  
  3. Indexes
    - Add unique index on email column for fast lookups and duplicate prevention
*/

-- Create the newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert their email address
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscriptions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only service role can read subscriptions (for admin/export purposes)
CREATE POLICY "Service role can read all subscriptions"
  ON newsletter_subscriptions
  FOR SELECT
  TO service_role
  USING (true);

-- Create index on email for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);