ALTER TABLE deck
    DROP COLUMN cards_verified;

ALTER TABLE deck
    ADD COLUMN cards_verified BOOLEAN DEFAULT TRUE;

UPDATE deck
SET cards_verified = FALSE
WHERE id > 13421135;

CREATE INDEX deck_cards_verified ON deck(cards_verified);

ALTER TABLE deck
    ALTER COLUMN cards_verified SET DEFAULT FALSE;
