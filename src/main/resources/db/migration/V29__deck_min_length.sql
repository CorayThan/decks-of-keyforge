ALTER TABLE deck
    ADD CONSTRAINT deck_card_ids_exists CHECK (char_length(card_ids) > 10);

ALTER TABLE deck
    ADD CONSTRAINT deck_card_names_string_exists CHECK (char_length(card_names_string) > 2);

ALTER TABLE deck
    ADD CONSTRAINT deck_house_names_string_exists CHECK (char_length(house_names_string) > 2);
