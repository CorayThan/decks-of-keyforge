ALTER TABLE extra_card_info
    ADD COLUMN enhancement_amber INT4;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_capture INT4;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_draw INT4;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_damage INT4;

UPDATE extra_card_info
SET enhancement_amber = 0;
UPDATE extra_card_info
SET enhancement_capture = 0;
UPDATE extra_card_info
SET enhancement_draw = 0;
UPDATE extra_card_info
SET enhancement_damage = 0;

ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_amber SET NOT NULL;
ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_capture SET NOT NULL;
ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_draw SET NOT NULL;
ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_damage SET NOT NULL;
