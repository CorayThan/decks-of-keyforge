ALTER TABLE tournament_participant
    ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE tournament_participant
    ADD COLUMN tourney_user_name VARCHAR(80);
