ALTER TABLE syn_trait_value
    ADD COLUMN card_types card_type[];
ALTER TABLE syn_trait_value
    ADD COLUMN card_traits text[];
ALTER TYPE card_type ADD VALUE IF NOT EXISTS 'TokenCreature';

ALTER TABLE deck_statistics_entity
    DROP COLUMN deck_stats;
