/*
  # Add Preview Flag to Episodes

  ## Overview
  This migration adds an `is_preview` flag to the episodes table to distinguish
  between real episodes imported from the RSS feed and preview/placeholder episodes.
  Preview episodes should not be shown on the landing page or considered for the
  latest episode display.

  ## Changes to Episodes Table
    - Add `is_preview` (boolean, default false) - Flag indicating if episode is a preview
    - Update existing episodes without a GUID to be marked as preview episodes
    - RSS-imported episodes (those with guid and rss_imported_at) remain is_preview = false

  ## Security
    - No RLS changes needed (inherits existing policies)

  ## Notes
    - Episodes imported from RSS feed automatically have is_preview = false
    - Manual/placeholder episodes without RSS data are marked as preview
    - Preview episodes can still be accessed directly but won't appear in latest episode
    - This ensures only real published episodes are featured on the landing page
*/

-- Add is_preview column to episodes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'episodes' AND column_name = 'is_preview'
  ) THEN
    ALTER TABLE episodes ADD COLUMN is_preview boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Mark all existing episodes without a GUID as preview episodes
-- These are the manually created episodes, not from RSS feed
UPDATE episodes
SET is_preview = true
WHERE guid IS NULL;

-- Ensure RSS-imported episodes are not marked as preview
UPDATE episodes
SET is_preview = false
WHERE guid IS NOT NULL;