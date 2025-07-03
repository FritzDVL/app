-- Function: increment_replies_count(thread_id uuid)

CREATE OR REPLACE FUNCTION increment_replies_count(thread_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE community_threads
  SET replies_count = replies_count + 1
  WHERE id = thread_id;
END;
$$ LANGUAGE plpgsql;
