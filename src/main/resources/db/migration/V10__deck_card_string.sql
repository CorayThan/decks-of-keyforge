
ALTER TABLE deck ADD COLUMN card_names_string character varying(5000);
CREATE INDEX deck_card_names_string_idx ON deck USING gin (card_names_string gin_trgm_ops);

CREATE INDEX maverick_count_idx ON deck (maverick_count);
