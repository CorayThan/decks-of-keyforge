ALTER TABLE IF EXISTS deck
    RENAME COLUMN previous_sas_rating TO sasv3;

ALTER TABLE deck
    ADD COLUMN previous_sas_rating INT4;

ALTER TABLE extra_card_info
    DROP COLUMN IF EXISTS rating;

ALTER TABLE extra_card_info
    ADD COLUMN card_name VARCHAR(255);
