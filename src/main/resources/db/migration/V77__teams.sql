ALTER TABLE user_deck
    ADD COLUMN team_id UUID;

CREATE TABLE team (
    name           VARCHAR(255) NOT NULL,
    team_leader_id UUID         NOT NULL,
    id             UUID         NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE key_user
    ADD COLUMN team_id UUID;

CREATE TABLE team_invites (
    team_id UUID NOT NULL,
    invites UUID NOT NULL
);

ALTER TABLE key_user
    ADD CONSTRAINT key_user_team_fk FOREIGN KEY (team_id) REFERENCES team;

ALTER TABLE team
    ADD CONSTRAINT team_leader_team_fk FOREIGN KEY (team_leader_id) REFERENCES key_user;
ALTER TABLE team_invites
    ADD CONSTRAINT team_invites_team_fk FOREIGN KEY (team_id) REFERENCES team;
ALTER TABLE team_invites
    ADD CONSTRAINT team_invites_user_id_fk FOREIGN KEY (invites) REFERENCES key_user;
ALTER TABLE user_deck
    ADD CONSTRAINT user_deck_team_id_fk FOREIGN KEY (team_id) REFERENCES team;

CREATE INDEX user_deck_owned_by ON user_deck(owned_by);
CREATE INDEX user_deck_team_id ON user_deck(team_id);

ALTER TABLE team
    ADD CONSTRAINT team_name_uk UNIQUE (name);
