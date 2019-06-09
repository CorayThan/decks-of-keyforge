ALTER TABLE deck
    DROP COLUMN stats_version;

ALTER TABLE deck_page
    ADD COLUMN type VARCHAR(255);

UPDATE deck_page
SET type = 'IMPORT';
