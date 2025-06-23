-- Community Threads Table
-- This table maps Lens Protocol posts to communities and stores thread metadata

CREATE TABLE community_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  lens_feed_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(community_id, lens_feed_address)
);

-- Indexes for better performance
CREATE INDEX idx_community_threads_community_id ON community_threads(community_id);
CREATE INDEX idx_community_threads_lens_feed_address ON community_threads(lens_feed_address);
CREATE INDEX idx_community_threads_created_at ON community_threads(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE community_threads ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON community_threads
  FOR SELECT USING (true);

-- Create policies for authenticated insert/update/delete
CREATE POLICY "Allow authenticated insert" ON community_threads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON community_threads
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON community_threads
  FOR DELETE USING (true);

-- Function to get community thread count
CREATE OR REPLACE FUNCTION get_community_thread_count(community_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM community_threads
    WHERE community_id = community_uuid
  );
END;
$$ LANGUAGE plpgsql;
