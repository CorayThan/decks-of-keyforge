ALTER TABLE key_user
    ADD COLUMN patreon_id CHARACTER VARYING(50);
ALTER TABLE key_user
    ADD CONSTRAINT patreon_id_uk UNIQUE (patreon_id);

ALTER TABLE key_user
    ADD COLUMN patreon_tier CHARACTER VARYING(50);

CREATE TABLE patreon_account (
    id            UUID NOT NULL,
    access_token  VARCHAR(1000),
    refresh_token VARCHAR(1000),
    scope         VARCHAR(1000),
    token_type    VARCHAR(1000),
    refreshed_at  TIMESTAMP,
    PRIMARY KEY (id)
);
