-- Add a members_count column to the communities table
ALTER TABLE communities ADD COLUMN members_count integer NOT NULL DEFAULT 0;

-- Function to increment members_count
CREATE OR REPLACE FUNCTION increment_community_members_count(comm_id uuid) RETURNS void AS $$
BEGIN
  UPDATE communities SET members_count = members_count + 1 WHERE id = comm_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement members_count
CREATE OR REPLACE FUNCTION decrement_community_members_count(comm_id uuid) RETURNS void AS $$
BEGIN
  UPDATE communities SET members_count = GREATEST(members_count - 1, 0) WHERE id = comm_id;
END;
$$ LANGUAGE plpgsql;
