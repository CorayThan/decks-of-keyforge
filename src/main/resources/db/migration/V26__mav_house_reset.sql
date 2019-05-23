ALTER TABLE deck
    DROP COLUMN card_names_with_house_string;
ALTER TABLE deck
    ADD COLUMN card_names_with_house_string CHARACTER VARYING(5000);
CREATE INDEX card_names_with_house_string_idx ON deck USING gin(card_names_with_house_string gin_trgm_ops);

ALTER TABLE deck
    DROP COLUMN house_names_string;
ALTER TABLE deck
    ADD COLUMN house_names_string CHARACTER VARYING(500);
CREATE INDEX house_names_string_idx ON deck USING gin(house_names_string gin_trgm_ops);
