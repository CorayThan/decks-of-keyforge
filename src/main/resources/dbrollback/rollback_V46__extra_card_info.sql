ALTER TABLE IF EXISTS card
    DROP COLUMN extra_info_id;

DROP TABLE IF EXISTS card_identifier CASCADE;
DROP TABLE IF EXISTS extra_card_info CASCADE;
DROP TABLE IF EXISTS extra_card_info_card_numbers CASCADE;
DROP TABLE IF EXISTS extra_card_info_synergies CASCADE;
DROP TABLE IF EXISTS extra_card_info_traits CASCADE;

DELETE
FROM flyway_schema_history
WHERE script = 'V46__extra_card_info.sql';
