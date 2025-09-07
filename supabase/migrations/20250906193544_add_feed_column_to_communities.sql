-- Add feed column to communities table
ALTER TABLE communities ADD COLUMN feed TEXT;
-- Optionally, add an index for faster lookup
CREATE INDEX idx_communities_feed ON communities(feed);
