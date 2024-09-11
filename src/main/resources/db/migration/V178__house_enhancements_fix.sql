ALTER TABLE extra_card_info
    DROP COLUMN enhancement_brobnar;
ALTER TABLE extra_card_info
    DROP COLUMN enhancement_dis;
ALTER TABLE extra_card_info
    DROP COLUMN enhancement_ekwidon;
ALTER TABLE extra_card_info
    DROP COLUMN enhancement_geistoid;
ALTER TABLE extra_card_info
    DROP COLUMN enhancement_logos;
ALTER TABLE extra_card_info
    DROP COLUMN enhancement_mars;
ALTER TABLE extra_card_info
    DROP COLUMN enhancement_skyborn;

ALTER TABLE extra_card_info
    ADD COLUMN enhancement_brobnar INT4 NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_dis INT4 NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_ekwidon INT4 NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_geistoid INT4 NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_logos INT4 NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_mars INT4 NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_skyborn INT4 NULL;

UPDATE extra_card_info
SET enhancement_brobnar  = 0,
    enhancement_dis      = 0,
    enhancement_ekwidon  = 0,
    enhancement_geistoid = 0,
    enhancement_logos    = 0,
    enhancement_mars     = 0,
    enhancement_skyborn  = 0;

ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_brobnar SET NOT NULL;
ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_dis SET NOT NULL;
ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_ekwidon SET NOT NULL;
ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_geistoid SET NOT NULL;
ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_logos SET NOT NULL;
ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_mars SET NOT NULL;
ALTER TABLE extra_card_info
    ALTER COLUMN enhancement_skyborn SET NOT NULL;
