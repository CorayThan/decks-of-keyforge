ALTER TABLE key_user
    ADD COLUMN agreed_to_terms_of_service BOOLEAN,
    ADD COLUMN created                    TIMESTAMP;

UPDATE key_user
SET agreed_to_terms_of_service = FALSE;

ALTER TABLE key_user
    ALTER COLUMN agreed_to_terms_of_service SET NOT NULL;


