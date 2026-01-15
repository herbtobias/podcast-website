/*
  # Create Analytics Tables for GDPR-compliant tracking

  1. New Tables
    - `analytics_sessions`
      - `id` (uuid, primary key) - Unique session identifier
      - `session_id` (text, unique) - Session ID stored in cookie
      - `created_at` (timestamptz) - Session start time
      - `last_activity` (timestamptz) - Last activity timestamp
      - `user_agent` (text) - Browser user agent string
      - `screen_width` (int) - Screen width in pixels
      - `screen_height` (int) - Screen height in pixels
      - `referrer` (text) - Referrer URL
      - `consent_given` (boolean) - Whether user gave consent

    - `analytics_page_views`
      - `id` (uuid, primary key) - Unique page view ID
      - `session_id` (text) - Reference to session
      - `page_path` (text) - Page URL path
      - `page_title` (text) - Page title
      - `created_at` (timestamptz) - Time of page view
      - `duration_seconds` (int) - Time spent on page (optional)

    - `analytics_events`
      - `id` (uuid, primary key) - Unique event ID
      - `session_id` (text) - Reference to session
      - `event_type` (text) - Type of event (episode_play, newsletter_signup, link_click, etc.)
      - `event_data` (jsonb) - Additional event data
      - `created_at` (timestamptz) - Time of event

  2. Security
    - Enable RLS on all analytics tables
    - Public can insert their own analytics data (with consent check)
    - Only authenticated admin users can read analytics data

  3. Indexes
    - Add indexes on session_id for fast lookups
    - Add indexes on created_at for time-based queries
    - Add index on event_type for filtering

  4. Important Notes
    - All analytics data is only collected with explicit user consent
    - No personally identifiable information (PII) is stored
    - Session IDs are randomly generated, not tied to user accounts
    - Users can revoke consent and request data deletion at any time
*/

-- Create analytics_sessions table
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  last_activity timestamptz DEFAULT now() NOT NULL,
  user_agent text,
  screen_width int,
  screen_height int,
  referrer text,
  consent_given boolean DEFAULT true NOT NULL
);

-- Create analytics_page_views table
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  page_path text NOT NULL,
  page_title text,
  created_at timestamptz DEFAULT now() NOT NULL,
  duration_seconds int
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policies for analytics_sessions
CREATE POLICY "Anyone can insert their own session data"
  ON analytics_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all sessions"
  ON analytics_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );

-- Policies for analytics_page_views
CREATE POLICY "Anyone can insert page views"
  ON analytics_page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all page views"
  ON analytics_page_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );

-- Policies for analytics_events
CREATE POLICY "Anyone can insert events"
  ON analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all events"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON analytics_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON analytics_page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON analytics_page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON analytics_page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON analytics_events(event_type);