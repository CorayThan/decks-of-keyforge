ALTER TABLE deck_listing
    ADD COLUMN accepting_offers BOOLEAN DEFAULT FALSE;

ALTER TABLE offer
    ADD COLUMN expires_in_days INT4 NOT NULL DEFAULT 3;

UPDATE deck_listing
SET accepting_offers = FALSE;

UPDATE deck_listing
SET status = 'AUCTION'
WHERE status = 'ACTIVE';
UPDATE deck_listing
SET status = 'SALE'
WHERE status = 'BUY_IT_NOW_ONLY';

ALTER TABLE deck_listing
    ALTER COLUMN accepting_offers SET NOT NULL;
