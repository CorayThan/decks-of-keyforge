ALTER TABLE syn_trait_value
    ADD COLUMN not_card_traits BOOLEAN;
UPDATE syn_trait_value
SET not_card_traits = FALSE;
ALTER TABLE syn_trait_value
    ALTER COLUMN not_card_traits SET NOT NULL;

CREATE TYPE CARD_TYPE AS ENUM ( 'Action', 'Artifact', 'Creature', 'Upgrade');

ALTER TABLE extra_card_info
    ADD COLUMN extra_card_types CARD_TYPE[];
