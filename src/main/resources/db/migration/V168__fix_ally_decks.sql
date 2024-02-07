ALTER TABLE alliance_deck
    DROP COLUMN updated_pips;

UPDATE deck_page
SET current_page = 310000
WHERE type = 'IMPORT';
