CREATE TABLE game_record
(
    player_one         VARCHAR   NOT NULL,
    player_one_deck_id VARCHAR   NOT NULL,
    player_two         VARCHAR   NOT NULL,
    player_two_deck_id VARCHAR   NOT NULL,
    winner             varchar   NULL,
    report_date_time   TIMESTAMP NOT NULL,
    id                 UUID      NOT NULL,
    PRIMARY KEY (id)
);

CREATE INDEX game_record_player_one_idx ON game_record (player_one);
CREATE INDEX game_record_player_one_deck_idx ON game_record (player_one_deck_id);
CREATE INDEX game_record_player_two_idx ON game_record (player_two);
CREATE INDEX game_record_player_two_deck_idx ON game_record (player_two_deck_id);

CREATE TABLE game_event
(
    message      VARCHAR NOT NULL,
    record_id    UUID    NOT NULL,
    event_number int4    NOT NULL,
    id           UUID    NOT NULL,
    PRIMARY KEY (id)
);

CREATE INDEX game_event_record_id_idx ON game_event (record_id);

ALTER TABLE game_event
    ADD CONSTRAINT game_event_record_id_fk FOREIGN KEY (record_id) REFERENCES game_record;
