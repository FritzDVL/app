-- Add title and summary columns to community_threads table
ALTER TABLE community_threads ADD COLUMN title TEXT NOT NULL DEFAULT '';
ALTER TABLE community_threads ADD COLUMN summary TEXT NOT NULL DEFAULT '';

-- Remove unique constraint from community_threads table
ALTER TABLE community_threads DROP CONSTRAINT IF EXISTS community_threads_community_id_lens_feed_address_key;
