ALTER TABLE deck
    ADD COLUMN import_date_time TIMESTAMP;

ALTER TABLE deck_statistics_entity
    ADD COLUMN expansion VARCHAR(255);
