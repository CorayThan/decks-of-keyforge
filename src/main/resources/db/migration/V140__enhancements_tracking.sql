ALTER TABLE deck
    DROP COLUMN cards_verified;

ALTER TABLE deck
    ADD COLUMN enhancements_added BOOLEAN DEFAULT FALSE;
