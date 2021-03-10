CREATE TABLE tournament_deck (
    id               INT8         NOT NULL,
    keyforge_deck_id VARCHAR(255) NOT NULL,
    participant_id   INT8         NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE tournament_pairing (
    id              INT8 NOT NULL,
    event_id        INT8 NOT NULL,
    player_one_id   INT8 NOT NULL,
    player_one_keys INT4,
    player_one_won  BOOLEAN,
    player_two_id   INT8,
    player_two_keys INT4,
    round_id        INT8 NOT NULL,
    tco_link        VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE tournament_participant (
    id       INT8    NOT NULL,
    dropped  BOOLEAN NOT NULL,
    event_id INT8    NOT NULL,
    user_id  UUID    NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE tournament_round (
    id           INT8    NOT NULL,
    active       BOOLEAN NOT NULL,
    round_number INT4    NOT NULL,
    tourney_id   INT8    NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE tournament_deck
    ADD CONSTRAINT tournament_deck_participant_fk FOREIGN KEY (participant_id) REFERENCES tournament_participant;

ALTER TABLE tournament_pairing
    ADD CONSTRAINT tournament_pairing_event_fk FOREIGN KEY (event_id) REFERENCES key_forge_event;
ALTER TABLE tournament_pairing
    ADD CONSTRAINT tournament_pairing_player_one_fk FOREIGN KEY (player_one_id) REFERENCES tournament_participant;
ALTER TABLE tournament_pairing
    ADD CONSTRAINT tournament_pairing_player_two_fk FOREIGN KEY (player_two_id) REFERENCES tournament_participant;
ALTER TABLE tournament_pairing
    ADD CONSTRAINT tournament_pairing_round_fk FOREIGN KEY (round_id) REFERENCES tournament_round;

ALTER TABLE tournament_participant
    ADD CONSTRAINT tournament_participant_event_fk FOREIGN KEY (event_id) REFERENCES key_forge_event;
ALTER TABLE tournament_participant
    ADD CONSTRAINT tournament_participant_user_fk FOREIGN KEY (user_id) REFERENCES key_user;

ALTER TABLE tournament_round
    ADD CONSTRAINT tournament_round_key_forge_event_fk FOREIGN KEY (tourney_id) REFERENCES key_forge_event;

ALTER TABLE key_forge_event
    ADD COLUMN run_tournament BOOLEAN;
ALTER TABLE key_forge_event
    ADD COLUMN private_tournament BOOLEAN;
ALTER TABLE key_forge_event
    ADD COLUMN tournament_stage VARCHAR(255);

UPDATE key_forge_event
SET run_tournament = FALSE, private_tournament = FALSE, tournament_stage = 'TOURNAMENT_NOT_STARTED';

ALTER TABLE key_forge_event
    ALTER COLUMN run_tournament SET NOT NULL;
ALTER TABLE key_forge_event
    ALTER COLUMN private_tournament SET NOT NULL;
ALTER TABLE key_forge_event
    ALTER COLUMN tournament_stage SET NOT NULL;
