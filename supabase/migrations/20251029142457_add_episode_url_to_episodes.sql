/*
  # Add Episode URL to Episodes

  ## Overview
  This migration adds an episode_url column to the episodes table to store
  the Spotify podcast episode URL from the RSS feed. This allows users to
  click on an episode and be redirected to the episode's page on Spotify.

  ## Changes to Episodes Table
    - Add `episode_url` (text, nullable) - URL to the episode on Spotify

  ## Security
    - No RLS changes needed (inherits existing policies)

  ## Notes
    - The episode URL is extracted from the RSS feed's <link> tag
    - This allows direct linking to episodes on Spotify's platform
    - Existing episodes without this field will have NULL values initially
*/

-- Add episode_url column to episodes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'episodes' AND column_name = 'episode_url'
  ) THEN
    ALTER TABLE episodes ADD COLUMN episode_url text;
  END IF;
END $$;