CREATE TABLE IF NOT EXISTS import_skipped_deck
(
    id               UUID    NOT NULL,
    deck_keyforge_id VARCHAR NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE import_skipped_deck
    ADD CONSTRAINT import_skipped_deck_deck_keyforge_id_uk UNIQUE (deck_keyforge_id);

ALTER TABLE extra_card_info
    ADD COLUMN enhancement_discard int4 NULL;
UPDATE extra_card_info
SET enhancement_discard = 0;
ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_discard SET NOT NULL;
