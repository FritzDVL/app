
-- Add featured column to communities table
ALTER TABLE communities 
ADD COLUMN featured INTEGER DEFAULT 0 NOT NULL;

-- Add index for better performance when querying featured communities
CREATE INDEX idx_communities_featured ON communities(featured) WHERE featured = 1;

-- Add check constraint to ensure featured is either 0 or 1
ALTER TABLE communities 
ADD CONSTRAINT chk_communities_featured 
CHECK (featured IN (0, 1));
