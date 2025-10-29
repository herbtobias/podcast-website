/*
  # Remove Season Column from Episodes

  ## Overview
  This migration removes the season column from the episodes table as the podcast
  will use continuous episode numbering without seasons (1, 2, 3, etc.).

  ## Changes to Episodes Table
    - Drop `season` column (no longer needed)

  ## Security
    - No RLS changes needed

  ## Notes
    - Episodes will be identified by episode number only
    - No data loss as season information is not required
    - This simplifies the podcast structure to a single continuous series
*/

-- Drop the season column from episodes table
ALTER TABLE episodes DROP COLUMN IF EXISTS season;