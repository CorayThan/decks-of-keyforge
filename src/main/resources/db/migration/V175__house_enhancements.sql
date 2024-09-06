ALTER TABLE extra_card_info
    ADD COLUMN enhancement_brobnar boolean NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_dis boolean NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_ekwidon boolean NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_geistoid boolean NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_logos boolean NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_mars boolean NULL;
ALTER TABLE extra_card_info
    ADD COLUMN enhancement_sky_born boolean NULL;

UPDATE extra_card_info
SET enhancement_brobnar  = FALSE,
    enhancement_dis      = FALSE,
    enhancement_ekwidon  = FALSE,
    enhancement_geistoid = FALSE,
    enhancement_logos    = FALSE,
    enhancement_mars     = FALSE,
    enhancement_sky_born = FALSE;

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
    ALTER COLUMN enhancement_sky_born SET NOT NULL;