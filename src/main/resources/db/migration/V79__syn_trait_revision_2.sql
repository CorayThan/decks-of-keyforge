ALTER TABLE syn_trait_value
    ADD COLUMN powers_string VARCHAR(255);

UPDATE syn_trait_value
SET powers_string = '';

ALTER TABLE syn_trait_value
    ALTER COLUMN powers_string SET NOT NULL;

ALTER TABLE syn_trait_value
    ADD COLUMN card_traits_string VARCHAR(510);

UPDATE syn_trait_value
SET card_traits_string = '';

ALTER TABLE syn_trait_value
    ALTER COLUMN card_traits_string SET NOT NULL;
