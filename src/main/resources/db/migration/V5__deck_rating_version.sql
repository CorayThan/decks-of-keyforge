
ALTER TABLE deck ADD COLUMN rating_version int4;
UPDATE deck SET rating_version = 1;
ALTER TABLE deck ALTER COLUMN rating_version SET NOT NULL;