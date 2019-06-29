ALTER TABLE deck
    ADD COLUMN card_names_string_improved CHARACTER VARYING(25000);
CREATE INDEX deck_card_names_string_improved_idx ON deck USING gin(card_names_string_improved gin_trgm_ops);
