ALTER TABLE deck
    ADD COLUMN adaptive_score INT4;

CREATE INDEX deck_adaptive_score_idx ON deck(adaptive_score);

ALTER TABLE extra_card_info
    ADD COLUMN adaptive_score INT4;

UPDATE extra_card_info
SET adaptive_score = 0;

ALTER TABLE extra_card_info
    ALTER COLUMN adaptive_score SET NOT NULL;

ALTER TABLE syn_trait_value
    ADD COLUMN primary_group BOOLEAN;

UPDATE syn_trait_value
SET primary_group = FALSE;

ALTER TABLE syn_trait_value
    ALTER COLUMN primary_group SET NOT NULL;
