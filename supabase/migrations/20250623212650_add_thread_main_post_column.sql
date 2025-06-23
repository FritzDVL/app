-- Add root_post_address column to community_threads table
ALTER TABLE community_threads
ADD COLUMN root_post_address TEXT;
