ALTER TABLE dok_card_expansion
    ADD COLUMN rarity varchar DEFAULT 'Common' NOT NULL;

ALTER TABLE past_sas
    ALTER COLUMN meta DROP NOT NULL;
