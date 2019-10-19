ALTER TABLE extra_card_info
    ADD COLUMN published TIMESTAMP;

UPDATE extra_card_info
SET published = '2019-10-16 00:30:09.230000' where version = 2;

UPDATE extra_card_info
SET published = '2019-09-22 00:30:09.230000' where version = 1;
