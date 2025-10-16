/*
  # Create episodes table

  ## Overview
  This migration creates a table to store podcast episodes with full-text search capabilities.
  Episodes are sorted by published date (newest first) and include all metadata needed for
  display and playback.

  ## New Tables
    - `episodes`
      - `id` (uuid, primary key) - Unique identifier for each episode
      - `title` (text, not null) - Episode title
      - `season` (integer, not null) - Season number
      - `episode` (integer, not null) - Episode number within the season
      - `duration` (text, not null) - Human-readable duration (e.g., "54:00")
      - `duration_minutes` (integer, not null) - Duration in minutes for sorting/filtering
      - `description` (text, not null) - Full episode description
      - `published_date` (timestamptz, not null) - When the episode was published
      - `audio_url` (text, not null) - URL to the audio file
      - `cover_image` (text, not null) - URL to the episode cover image
      - `created_at` (timestamptz) - Timestamp when record was created

  ## Security
    - Enable RLS on `episodes` table
    - Add policy for public read access (anyone can view episodes)
    - No insert/update/delete policies (episodes managed through admin interface)

  ## Notes
    - Table is optimized for full-text search on title and description fields
    - Published date allows for chronological sorting (newest first)
    - All episodes are publicly accessible for podcast discovery
*/

CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  season integer NOT NULL,
  episode integer NOT NULL,
  duration text NOT NULL,
  duration_minutes integer NOT NULL,
  description text NOT NULL,
  published_date timestamptz NOT NULL,
  audio_url text NOT NULL,
  cover_image text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Episodes are publicly accessible"
  ON episodes
  FOR SELECT
  TO anon, authenticated
  USING (true);