DROP TABLE IF EXISTS deck_houses;

ALTER TABLE deck DROP COLUMN card_names_string;
ALTER TABLE deck DROP COLUMN card_names_with_house_string;
ALTER TABLE deck RENAME COLUMN card_names_string_improved TO card_names;
