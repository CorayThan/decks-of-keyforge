ALTER TABLE syn_trait_value
    DROP COLUMN base_syn_percent;

ALTER TABLE extra_card_info
    ADD COLUMN base_syn_percent INT4;
