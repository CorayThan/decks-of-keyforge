ALTER TABLE deck_listing
    ADD COLUMN has_ownership_verification BOOLEAN;

UPDATE deck_listing
SET has_ownership_verification = FALSE;

ALTER TABLE deck_listing
    ALTER COLUMN has_ownership_verification SET NOT NULL;

ALTER TABLE deck
    ADD COLUMN has_ownership_verification BOOLEAN;

ALTER TABLE key_user
    ADD COLUMN auto_renew_listings BOOLEAN;

UPDATE key_user
SET auto_renew_listings = FALSE;

ALTER TABLE key_user
    ALTER COLUMN auto_renew_listings SET NOT NULL;