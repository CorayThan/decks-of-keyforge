ALTER TABLE key_user
    ADD COLUMN email_verified BOOLEAN;

UPDATE key_user
SET email_verified = 'false';

ALTER TABLE key_user
    ALTER COLUMN email_verified SET NOT NULL;
