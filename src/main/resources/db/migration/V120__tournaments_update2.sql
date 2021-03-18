DELETE
FROM tournament_deck;
DELETE
FROM tournament_pairing;
DELETE
FROM tournament_participant;
DELETE
FROM tournament_round;
DELETE
FROM tournament_organizer;

ALTER TABLE key_forge_event
    ADD COLUMN tournament_only BOOLEAN;
UPDATE key_forge_event
SET tourney_id = NULL, tournament_only = FALSE;
ALTER TABLE key_forge_event
    ALTER COLUMN tournament_only SET NOT NULL;

DELETE
FROM tournament;

ALTER TABLE tournament_deck
    DROP COLUMN keyforge_deck_id;
ALTER TABLE tournament_deck
    DROP COLUMN deck_name;

ALTER TABLE tournament_deck
    ADD COLUMN deck_id INT8;
ALTER TABLE tournament_deck
    ALTER COLUMN deck_id SET NOT NULL;

ALTER TABLE tournament_deck
    ADD CONSTRAINT tournament_deck_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;

ALTER TABLE tournament
    ADD COLUMN started TIMESTAMP;
ALTER TABLE tournament
    ADD COLUMN ended TIMESTAMP;

ALTER TABLE key_user
    ADD COLUMN tco_username VARCHAR(255);

ALTER TABLE tournament_participant
    RENAME COLUMN event_id TO tournament_id;
ALTER TABLE tournament_pairing
    RENAME COLUMN event_id TO tournament_id;

CREATE INDEX tournament_deck_tourney_idx ON tournament_deck(tourney_id);
CREATE INDEX tournament_participant_tourney_idx ON tournament_participant(tournament_id);
CREATE INDEX tournament_pairing_tourney_idx ON tournament_pairing(tournament_id);
CREATE INDEX tournament_organizer_tourney_idx ON tournament_organizer(tourney_id);
CREATE INDEX tournament_round_tourney_idx ON tournament_round(tourney_id);
