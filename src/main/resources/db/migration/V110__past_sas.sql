ALTER TABLE deck
    DROP COLUMN adaptive_score;

CREATE TABLE past_sas (
    id                  INT8      NOT NULL,
    deck_id             INT8      NOT NULL,

    expected_amber      FLOAT8    NOT NULL,
    amber_control       FLOAT8    NOT NULL,
    creature_control    FLOAT8    NOT NULL,
    artifact_control    FLOAT8    NOT NULL,
    efficiency          FLOAT8    NOT NULL,
    creature_protection FLOAT8    NOT NULL,
    disruption          FLOAT8    NOT NULL,
    other               FLOAT8    NOT NULL,
    effective_power     INT4      NOT NULL,

    sas_rating          INT4      NOT NULL,
    synergy_rating      INT4      NOT NULL,
    antisynergy_rating  INT4      NOT NULL,
    aerc_score          INT4      NOT NULL,
    aerc_version        INT4      NOT NULL,
    meta                INT4      NOT NULL,

    update_date_time    TIMESTAMP NOT NULL,

    PRIMARY KEY (id)
);

ALTER TABLE past_sas
    ADD CONSTRAINT pas_sas_deck_id_fk FOREIGN KEY (deck_id) REFERENCES deck;

CREATE INDEX past_sas_deck_id_idx ON past_sas(deck_id);
