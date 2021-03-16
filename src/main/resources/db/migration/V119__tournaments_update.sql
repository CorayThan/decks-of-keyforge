ALTER TABLE tournament_deck
    ADD COLUMN deck_name VARCHAR(255);
ALTER TABLE tournament_deck
    ALTER COLUMN deck_name SET NOT NULL;

ALTER TABLE tournament_deck
    ADD COLUMN deck_order INT4;
ALTER TABLE tournament_deck
    ALTER COLUMN deck_order SET NOT NULL;

ALTER TABLE tournament_deck
    ADD COLUMN tourney_id INT8;
ALTER TABLE tournament_deck
    ALTER COLUMN tourney_id SET NOT NULL;

ALTER TABLE tournament_deck
    ADD CONSTRAINT tournament_deck_tourney_fk FOREIGN KEY (tourney_id) REFERENCES tournament;

ALTER TABLE tournament
    ADD COLUMN "type" VARCHAR(255);
UPDATE tournament
SET "type" = 'SWISS';
ALTER TABLE tournament
    ALTER COLUMN "type" SET NOT NULL;

ALTER TABLE tournament_pairing
    ADD COLUMN player_one_wins INT4;
UPDATE tournament_pairing
SET player_one_wins = 0;
ALTER TABLE tournament_pairing
    ALTER COLUMN player_one_wins SET NOT NULL;

ALTER TABLE tournament_pairing
    ADD COLUMN player_two_wins INT4;
UPDATE tournament_pairing
SET player_two_wins = 0;
ALTER TABLE tournament_pairing
    ALTER COLUMN player_two_wins SET NOT NULL;

CREATE UNIQUE INDEX tournament_participant_user_id_event_id_idx ON tournament_participant(user_id, event_id);
CREATE UNIQUE INDEX tournament_deck_deck_id_participant_id_idx ON tournament_deck(keyforge_deck_id, participant_id);
