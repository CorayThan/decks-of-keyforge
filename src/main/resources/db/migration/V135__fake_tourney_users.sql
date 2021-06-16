ALTER TABLE tournament_participant
    ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE tournament_participant
    ADD COLUMN tourney_user_name VARCHAR(80);

ALTER TABLE tournament
    ADD COLUMN allow_self_reporting BOOLEAN;

UPDATE tournament
SET allow_self_reporting = TRUE;

ALTER TABLE tournament
    ALTER COLUMN allow_self_reporting SET NOT NULL;

ALTER TABLE tournament
    ADD COLUMN visibility VARCHAR(255);

UPDATE tournament
SET visibility = 'PUBLIC';

ALTER TABLE tournament
    ALTER COLUMN visibility SET NOT NULL;
