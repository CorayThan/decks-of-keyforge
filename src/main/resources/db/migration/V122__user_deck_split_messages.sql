ALTER TABLE user_deck
    ADD COLUMN migrated BOOLEAN;

CREATE TABLE favorited_deck (
    user_id UUID NOT NULL,
    deck_id INT8 NOT NULL,
    id      INT8 NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE favorited_deck
    ADD CONSTRAINT favorited_deck_user_id_fk FOREIGN KEY (user_id) REFERENCES key_user;
ALTER TABLE favorited_deck
    ADD CONSTRAINT favorited_deck_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;

ALTER TABLE favorited_deck
    ADD UNIQUE (deck_id, user_id);


CREATE TABLE funny_deck (
    user_id UUID NOT NULL,
    deck_id INT8 NOT NULL,
    id      INT8 NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE funny_deck
    ADD CONSTRAINT funny_deck_user_id_fk FOREIGN KEY (user_id) REFERENCES key_user;
ALTER TABLE funny_deck
    ADD CONSTRAINT funny_deck_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;

ALTER TABLE funny_deck
    ADD UNIQUE (deck_id, user_id);


CREATE TABLE owned_deck (
    owner_id UUID      NOT NULL,
    deck_id  INT8      NOT NULL,
    team_id  UUID,
    added    TIMESTAMP NOT NULL,
    id       INT8      NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE owned_deck
    ADD CONSTRAINT owned_deck_owner_id_fk FOREIGN KEY (owner_id) REFERENCES key_user;
ALTER TABLE owned_deck
    ADD CONSTRAINT owned_deck_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;
ALTER TABLE owned_deck
    ADD CONSTRAINT owned_deck_team_fk FOREIGN KEY (team_id) REFERENCES team;

ALTER TABLE owned_deck
    ADD UNIQUE (deck_id, owner_id);

CREATE INDEX owned_deck_team_id_idx ON owned_deck(team_id);


--Start messages section

CREATE TABLE blocked_user (
    id            INT8 NOT NULL,
    block_id      UUID,
    blocked_by_id UUID,
    PRIMARY KEY (id)
);
ALTER TABLE key_user
    ADD COLUMN allows_messages BOOLEAN;

UPDATE key_user
SET allows_messages = TRUE;

ALTER TABLE key_user
    ALTER COLUMN allows_messages SET NOT NULL;

CREATE TABLE private_message (
    id               INT8    NOT NULL,
    message          VARCHAR(4000),
    recipient_hidden BOOLEAN NOT NULL,
    replied          TIMESTAMP,
    reply_to_id      INT8,
    sender_hidden    BOOLEAN NOT NULL,
    sent             TIMESTAMP,
    subject          VARCHAR(400),
    viewed           TIMESTAMP,
    deck_id          INT8,
    from_id          UUID,
    to_id            UUID,
    PRIMARY KEY (id)
);
ALTER TABLE private_message
    ADD CONSTRAINT private_message_deck_id_fk FOREIGN KEY (deck_id) REFERENCES deck;
ALTER TABLE private_message
    ADD CONSTRAINT private_message_from_id_fk FOREIGN KEY (from_id) REFERENCES key_user;
ALTER TABLE private_message
    ADD CONSTRAINT private_message_to_id_fk FOREIGN KEY (to_id) REFERENCES key_user;
ALTER TABLE tournament_organizer
    ADD CONSTRAINT tournament_organizer_organizer_id_fk FOREIGN KEY (organizer_id) REFERENCES key_user;
ALTER TABLE tournament_organizer
    ADD CONSTRAINT tournament_organizer_tournament_id_fk FOREIGN KEY (tourney_id) REFERENCES tournament;

CREATE UNIQUE INDEX blocked_user_blocked_by_blocked_idx ON blocked_user(blocked_by_id, block_id);
CREATE INDEX private_message_from_id_idx ON private_message(from_id);
CREATE INDEX private_message_to_id_idx ON private_message(to_id);
CREATE INDEX private_message_reply_to_id_idx ON private_message(reply_to_id);
