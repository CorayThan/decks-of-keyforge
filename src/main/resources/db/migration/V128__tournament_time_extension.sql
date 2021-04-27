CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE tournament_round
    ADD COLUMN time_extended_minutes INT4;

ALTER TABLE deck
    ADD COLUMN twin_id varchar(255);

CREATE TABLE post_process_deck (
    deck_id INT8 NOT NULL,
    id      UUID NOT NULL DEFAULT uuid_generate_v4(),
    PRIMARY KEY (id)
);

ALTER TABLE post_process_deck
    ADD CONSTRAINT post_process_deck_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;

INSERT INTO post_process_deck (deck_id)
SELECT id
FROM deck
WHERE deck.expansion = 496;
