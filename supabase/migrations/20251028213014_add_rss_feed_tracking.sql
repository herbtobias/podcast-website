/*
  # Add RSS Feed Tracking Fields

  ## Overview
  This migration extends the episodes table to support RSS feed synchronization
  by adding fields to track RSS feed identifiers and sync timestamps. It also
  adds a sync log table to track all RSS import operations.

  ## Changes to Episodes Table
    - Add `guid` (text, unique) - RSS feed item GUID for reliable episode tracking
    - Add `rss_imported_at` (timestamptz) - Timestamp of last RSS sync for this episode
    - Add unique constraint on `guid` to prevent duplicate imports
    - Create index on `guid` for fast lookups during sync operations
    - Create index on `audio_url` for duplicate detection fallback

  ## New Tables
    - `rss_sync_log`
      - `id` (uuid, primary key) - Unique identifier for each sync operation
      - `started_at` (timestamptz, not null) - When the sync started
      - `completed_at` (timestamptz) - When the sync completed (null if failed)
      - `status` (text, not null) - Status: 'success', 'failed', 'partial'
      - `episodes_added` (integer) - Number of new episodes imported
      - `episodes_updated` (integer) - Number of existing episodes updated
      - `episodes_total` (integer) - Total episodes in RSS feed
      - `error_message` (text) - Error details if sync failed
      - `created_at` (timestamptz) - Timestamp when record was created

  ## Security
    - Enable RLS on `rss_sync_log` table
    - Add policy for public read access to sync logs
    - Service role can insert/update sync logs

  ## Notes
    - GUID is the primary identifier for matching RSS feed items to database episodes
    - If GUID is not available, audio_url serves as fallback identifier
    - Sync log table provides audit trail for all RSS import operations
    - Indexes optimize the sync process for large episode catalogs
*/

-- Add RSS tracking fields to episodes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'episodes' AND column_name = 'guid'
  ) THEN
    ALTER TABLE episodes ADD COLUMN guid text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'episodes' AND column_name = 'rss_imported_at'
  ) THEN
    ALTER TABLE episodes ADD COLUMN rss_imported_at timestamptz;
  END IF;
END $$;

-- Create unique constraint on guid (only if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'episodes_guid_key'
  ) THEN
    ALTER TABLE episodes ADD CONSTRAINT episodes_guid_key UNIQUE (guid);
  END IF;
END $$;

-- Create indexes for efficient lookups during sync
CREATE INDEX IF NOT EXISTS idx_episodes_guid ON episodes(guid);
CREATE INDEX IF NOT EXISTS idx_episodes_audio_url ON episodes(audio_url);

-- Create RSS sync log table
CREATE TABLE IF NOT EXISTS rss_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  episodes_added integer DEFAULT 0,
  episodes_updated integer DEFAULT 0,
  episodes_total integer DEFAULT 0,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on sync log table
ALTER TABLE rss_sync_log ENABLE ROW LEVEL SECURITY;

-- Allow public read access to sync logs
CREATE POLICY "Sync logs are publicly readable"
  ON rss_sync_log
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create index on sync log for recent history queries
CREATE INDEX IF NOT EXISTS idx_rss_sync_log_started_at ON rss_sync_log(started_at DESC);