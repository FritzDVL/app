-- Add 'visible' column to communities table
ALTER TABLE communities
ADD COLUMN visible BOOLEAN NOT NULL DEFAULT TRUE;

-- Add 'visible' column to community_threads table
ALTER TABLE community_threads
ADD COLUMN visible BOOLEAN NOT NULL DEFAULT TRUE;
