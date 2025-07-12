-- Rename column 'root_post_address' to 'root_post_id' if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='community_threads' AND column_name='root_post_address'
  ) THEN
    ALTER TABLE community_threads RENAME COLUMN root_post_address TO root_post_id;
  END IF;
END $$;
