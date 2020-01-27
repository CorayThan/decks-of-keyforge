ALTER TABLE key_user
    ADD COLUMN seller_email_verified BOOLEAN;

UPDATE key_user
SET seller_email_verified = 'false';

ALTER TABLE key_user
    ALTER COLUMN seller_email_verified SET NOT NULL;
