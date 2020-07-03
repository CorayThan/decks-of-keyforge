CREATE TABLE deck_ownership (
    deck_id          INT8         NOT NULL,
    user_id          UUID         NOT NULL,
    id               INT8         NOT NULL,
    key              VARCHAR(255) NOT NULL,
    upload_date_time TIMESTAMP    NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE deck_ownership
    ADD CONSTRAINT deck_ownership_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;
ALTER TABLE deck_ownership
    ADD CONSTRAINT deck_ownership_user_fk FOREIGN KEY (user_id) REFERENCES key_user;

CREATE INDEX deck_ownership_deck_idx ON deck_ownership(deck_id);
CREATE INDEX deck_ownership_user_idx ON deck_ownership(user_id);
