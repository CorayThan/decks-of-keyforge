CREATE TABLE user_img (
    id       UUID          NOT NULL,
    tag      VARCHAR(255)  NOT NULL,
    user_id  UUID          NOT NULL,
    img_name VARCHAR(4000) NOT NULL,

    created  TIMESTAMP     NOT NULL,

    PRIMARY KEY (id)
);

ALTER TABLE user_img
    ADD CONSTRAINT user_img_user_id_fk FOREIGN KEY (user_id) REFERENCES key_user;

CREATE INDEX user_img_tag_idx ON user_img(tag);
CREATE INDEX user_img_user_id_idx ON user_img(user_id);

CREATE TABLE key_forge_event (
    id              INT8         NOT NULL,
    name            VARCHAR(255) NOT NULL,
    description     VARCHAR(2000) NOT NULL,
    start_date_time TIMESTAMP    NOT NULL,
    banner          VARCHAR(4000),
    entry_fee       VARCHAR(255),
    duration        VARCHAR(255),
    signup_link     VARCHAR(2000) NOT NULL,
    discord_server  VARCHAR(2000),

    online          BOOLEAN      NOT NULL,
    sealed          BOOLEAN      NOT NULL,

    format          VARCHAR(255) NOT NULL,
    country         VARCHAR(255),
    state           VARCHAR(255),
    created_by_id   UUID         NOT NULL,
    promoted        BOOLEAN      NOT NULL,

    created         TIMESTAMP    NOT NULL,

    PRIMARY KEY (id)
);

ALTER TABLE key_forge_event
    ADD CONSTRAINT kf_event_created_by_fk FOREIGN KEY (created_by_id) REFERENCES key_user;

CREATE INDEX kf_event_start_date_time_idx ON key_forge_event(start_date_time);
CREATE INDEX kf_event_format_idx ON key_forge_event(format);
CREATE INDEX kf_event_promoted_idx ON key_forge_event(promoted);
CREATE INDEX kf_event_sealed_idx ON key_forge_event(sealed);
CREATE INDEX kf_event_created_by_id_idx ON key_forge_event(created_by_id);
