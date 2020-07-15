ALTER TABLE syn_trait_value
    ADD COLUMN not_card_traits BOOLEAN;
UPDATE syn_trait_value
SET not_card_traits = FALSE;
ALTER TABLE syn_trait_value
    ALTER COLUMN not_card_traits SET NOT NULL;
