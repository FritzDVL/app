ALTER TABLE communities
ADD COLUMN name TEXT;

UPDATE communities SET name = '' WHERE name IS NULL;

ALTER TABLE communities
ALTER COLUMN name SET NOT NULL;
