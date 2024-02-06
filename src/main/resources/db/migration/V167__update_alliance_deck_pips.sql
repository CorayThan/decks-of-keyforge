ALTER TABLE alliance_deck
    ADD COLUMN updated_pips bool NULL;
UPDATE alliance_deck
SET updated_pips = FALSE;
ALTER TABLE alliance_deck
    ALTER COLUMN updated_pips SET NOT NULL;
