ALTER TABLE key_user
    ADD COLUMN rating FLOAT8;
UPDATE key_user
SET rating = 0;
ALTER TABLE key_user
    ALTER COLUMN rating SET NOT NULL;
