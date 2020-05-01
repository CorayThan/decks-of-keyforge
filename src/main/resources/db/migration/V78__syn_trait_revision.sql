ALTER TABLE syn_trait_value
    RENAME COLUMN type TO house;

ALTER TABLE syn_trait_value
    ADD COLUMN player VARCHAR(255);

UPDATE syn_trait_value
SET player = 'ANY';

ALTER TABLE syn_trait_value
    ALTER COLUMN player SET NOT NULL;

ALTER TABLE syn_trait_value
    ADD COLUMN card_types_string VARCHAR(255);

UPDATE syn_trait_value
SET card_types_string = '';

ALTER TABLE syn_trait_value
    ALTER COLUMN card_types_string SET NOT NULL;
