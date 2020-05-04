ALTER TABLE syn_trait_value
    ADD COLUMN base_syn_percent INT4;

UPDATE syn_trait_value
SET base_syn_percent = 0;

ALTER TABLE syn_trait_value
    ALTER COLUMN base_syn_percent SET NOT NULL;
