ALTER TABLE spoiler
    ADD COLUMN recursion FLOAT8;
UPDATE spoiler
SET recursion = 0;
ALTER TABLE spoiler
    ALTER COLUMN recursion SET NOT NULL;

ALTER TABLE past_sas
    ADD COLUMN recursion FLOAT8;
UPDATE past_sas
SET recursion = 0;
ALTER TABLE past_sas
    ALTER COLUMN recursion SET NOT NULL;

ALTER TABLE extra_card_info
    ADD COLUMN recursion FLOAT8;
UPDATE extra_card_info
SET recursion = 0;
ALTER TABLE extra_card_info
    ALTER COLUMN recursion SET NOT NULL;

ALTER TABLE extra_card_info
    ADD COLUMN recursion_max FLOAT8;

ALTER TABLE deck
    ADD COLUMN recursion FLOAT8;

CREATE INDEX deck_recursion_idx ON deck(recursion);
