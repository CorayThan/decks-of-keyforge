ALTER TABLE IF EXISTS extra_card_info
    ADD COLUMN version INT4;
ALTER TABLE IF EXISTS extra_card_info
    ADD COLUMN active BOOLEAN;
ALTER TABLE extra_card_info
    ADD COLUMN updated TIMESTAMP;
ALTER TABLE extra_card_info
    ADD COLUMN created TIMESTAMP;

UPDATE extra_card_info
SET version = 1;
UPDATE extra_card_info
SET active = TRUE;
UPDATE extra_card_info
SET updated = '2019-10-11 01:00:00.000000';
UPDATE extra_card_info
SET created = '2019-10-11 01:00:00.000000';
