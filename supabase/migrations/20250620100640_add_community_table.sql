-- Communities Table
-- This table stores basic information about Lens Protocol communities

CREATE TABLE communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lens_group_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_communities_lens_group_address ON communities(lens_group_address);
CREATE INDEX idx_communities_created_at ON communities(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON communities
  FOR SELECT USING (true);

-- Create policies for authenticated insert/update/delete
CREATE POLICY "Allow authenticated insert" ON communities
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON communities
  FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON communities
  FOR DELETE USING (true);
