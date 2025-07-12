-- Add 'featured' column to community_threads table
ALTER TABLE community_threads ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
