CREATE TABLE ktag (
    name VARCHAR(255) NOT NULL,
    creator_id UUID NOT NULL,
    publicity_type VARCHAR(255) NOT NULL,
    views INT4 NOT NULL,
    views_this_month INT4 NOT NULL,
    created TIMESTAMP NOT NULL,
    last_seen TIMESTAMP NOT NULL,
    id INT8 NOT NULL,
    PRIMARY KEY (id)
);

CREATE INDEX tag_views_idx ON ktag(views);
CREATE INDEX tag_views_this_month_idx ON ktag(views_this_month);
CREATE INDEX tag_publicity_type_idx ON ktag(publicity_type);
CREATE INDEX tag_creator_id_idx ON ktag(creator_id);

ALTER TABLE ktag
    ADD CONSTRAINT ktag_creator_fk FOREIGN KEY (creator_id) REFERENCES key_user;

CREATE TABLE decktag (
    tag_id INT8 NOT NULL,
    deck_id INT8 NOT NULL,
    id INT8 NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE decktag
    ADD CONSTRAINT decktag_tag_fk FOREIGN KEY (tag_id) REFERENCES ktag;
ALTER TABLE decktag
    ADD CONSTRAINT decktag_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;

ALTER TABLE decktag
    ADD UNIQUE (deck_id, tag_id);

CREATE TABLE previously_owned_deck (
    previous_owner_id UUID NOT NULL,
    deck_id INT8 NOT NULL,
    id INT8 NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE previously_owned_deck
    ADD CONSTRAINT previously_owned_deck_previous_owner_fk FOREIGN KEY (previous_owner_id) REFERENCES key_user;
ALTER TABLE previously_owned_deck
    ADD CONSTRAINT previously_owned_deck_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;

ALTER TABLE previously_owned_deck
    ADD UNIQUE (deck_id, previous_owner_id);


