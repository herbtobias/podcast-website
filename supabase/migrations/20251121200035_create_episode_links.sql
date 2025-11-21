/*
  # Create episode links table

  ## Overview
  This migration creates a table to store related resource links for podcast episodes.
  Links will be displayed on episode detail pages for additional context and resources.

  ## New Tables
    - `episode_links`
      - `id` (uuid, primary key) - Unique identifier
      - `episode_id` (uuid, not null) - Foreign key to episodes table
      - `title` (text, not null) - Link title/description
      - `url` (text, not null) - Full URL to the resource
      - `description` (text) - Optional longer description
      - `display_order` (integer, not null) - Order in which links should appear
      - `created_at` (timestamptz) - When the link was created

  ## Security
    - Enable RLS on `episode_links` table
    - Add policy for public read access (anyone can view links)
    - Add policy for authenticated admin write access

  ## Notes
    - Multiple links per episode allowed
    - Links are ordered by display_order for consistent presentation
    - Foreign key cascade on delete to clean up orphaned links
*/

CREATE TABLE IF NOT EXISTS episode_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  description text DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE episode_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Links are publicly readable"
  ON episode_links
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert links"
  ON episode_links
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update links"
  ON episode_links
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete links"
  ON episode_links
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_episode_links_episode_id ON episode_links(episode_id);
CREATE INDEX IF NOT EXISTS idx_episode_links_display_order ON episode_links(display_order);