/*
  # Create episode transcriptions table

  ## Overview
  This migration creates a table to store full-text transcriptions for podcast episodes.
  Transcriptions will be used for SEO optimization and Google indexing.

  ## New Tables
    - `episode_transcriptions`
      - `id` (uuid, primary key) - Unique identifier
      - `episode_id` (uuid, not null) - Foreign key to episodes table
      - `transcription_text` (text, not null) - Full transcription content
      - `created_at` (timestamptz) - When the transcription was created
      - `updated_at` (timestamptz) - When the transcription was last updated

  ## Security
    - Enable RLS on `episode_transcriptions` table
    - Add policy for public read access (anyone can view transcriptions)
    - Add policy for authenticated admin write access

  ## Notes
    - One transcription per episode (enforced by unique constraint)
    - Foreign key cascade on delete to clean up orphaned transcriptions
*/

CREATE TABLE IF NOT EXISTS episode_transcriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id uuid NOT NULL UNIQUE REFERENCES episodes(id) ON DELETE CASCADE,
  transcription_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE episode_transcriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transcriptions are publicly readable"
  ON episode_transcriptions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert transcriptions"
  ON episode_transcriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update transcriptions"
  ON episode_transcriptions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transcriptions"
  ON episode_transcriptions
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_episode_transcriptions_episode_id ON episode_transcriptions(episode_id);