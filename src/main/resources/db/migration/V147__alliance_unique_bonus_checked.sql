ALTER TABLE deck
    ADD COLUMN refreshed_bonus_icons BOOLEAN NULL;

ALTER TABLE alliance_deck
    ADD COLUMN checked_uniqueness boolean DEFAULT FALSE NOT NULL;

CREATE INDEX deck_refreshed_bonus_icons ON deck (refreshed_bonus_icons);

ALTER TABLE alliance_deck
    ALTER COLUMN bonus_icons_string DROP NOT NULL;
UPDATE alliance_deck
SET bonus_icons_string = NULL;

ALTER TABLE alliance_deck
    RENAME COLUMN alliance_houses_unique_ids TO houses_unique_id;
