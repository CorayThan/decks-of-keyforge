ALTER TABLE deck
    ADD COLUMN bonus_capture INT4;

CREATE INDEX deck_bonus_capture_idx ON deck(bonus_capture);

ALTER TABLE deck
    ADD COLUMN bonus_draw INT4;

CREATE INDEX deck_bonus_draw_idx ON deck(bonus_draw);

DROP INDEX deck_creature_protection_idx;
DROP INDEX deck_aerc_desc_id_idx;
DROP INDEX deck_aerc_asc_id_idx;
DROP INDEX anomaly_count_idx;
