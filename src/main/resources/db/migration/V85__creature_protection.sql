ALTER TABLE deck
    ADD COLUMN creature_protection FLOAT8;

CREATE INDEX deck_creature_protection_idx ON deck(creature_protection);

ALTER TABLE extra_card_info
    RENAME COLUMN amber_protection TO creature_protection;
ALTER TABLE extra_card_info
    RENAME COLUMN amber_protection_max TO creature_protection_max;
