DROP TYPE IF EXISTS play_zone;
CREATE TYPE play_zone AS ENUM ( 'deck', 'hand', 'play', 'discard', 'purged', 'archives');

ALTER TABLE syn_trait_value
    ADD COLUMN IF NOT EXISTS from_zones play_zone[];

CREATE INDEX IF NOT EXISTS deck_search_values_name_desc_id_idx ON deck_sas_values_searchable (name DESC, id);
CREATE INDEX IF NOT EXISTS deck_search_values_name_asc_id_idx ON deck_sas_values_searchable (name ASC, id);

ALTER TABLE dok_card
    DROP COLUMN IF EXISTS rarity;
