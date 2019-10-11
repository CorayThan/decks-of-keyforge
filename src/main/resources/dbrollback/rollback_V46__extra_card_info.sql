ALTER TABLE IF EXISTS card
    DROP COLUMN extra_info_id;

DROP TABLE IF EXISTS card_identifier CASCADE;
DROP TABLE IF EXISTS extra_card_info CASCADE;

DELETE FROM syn_trait_value;

ALTER TABLE IF EXISTS syn_trait_value
    DROP COLUMN synergy_info_id;
ALTER TABLE IF EXISTS syn_trait_value
    DROP COLUMN trait_info_id;
ALTER TABLE IF EXISTS syn_trait_value
    ALTER COLUMN type TYPE INT4 USING (type::integer);
ALTER TABLE IF EXISTS syn_trait_value
    ALTER COLUMN trait TYPE INT4 USING (trait::integer);

ALTER TABLE IF EXISTS card
    DROP COLUMN expansion_enum;

DELETE
FROM flyway_schema_history
WHERE script = 'V46__extra_card_info.sql';
