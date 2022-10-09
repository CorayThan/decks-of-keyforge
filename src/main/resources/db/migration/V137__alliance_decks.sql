ALTER TABLE theoretical_deck
    ADD COLUMN alliance BOOLEAN;

DELETE
FROM theoretical_deck
WHERE creator_id IS NULL;

UPDATE theoretical_deck
SET alliance = FALSE;

ALTER TABLE theoretical_deck
    ALTER COLUMN alliance SET NOT NULL;

ALTER TABLE theoretical_deck
    ALTER COLUMN creator_id SET NOT NULL;

ALTER TABLE theoretical_deck
    ALTER COLUMN expansion DROP NOT NULL;
