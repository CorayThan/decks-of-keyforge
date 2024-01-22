DROP INDEX IF EXISTS deck_power_level_idx;
DROP INDEX IF EXISTS completed_auction_idx;
CREATE INDEX IF NOT EXISTS deck_listed_on_idx ON deck (listed_on DESC, id);

CREATE TABLE IF NOT EXISTS deck_search_values1
(
    id                  int8      NOT NULL,

    name                varchar   NOT NULL,
    expansion           int4      NOT NULL,
    maverick_count      int4      NOT NULL,
    raw_amber           int4      NOT NULL,
    bonus_draw          int4      NOT NULL,
    bonus_capture       int4      NOT NULL,
    creature_count      int4      NOT NULL,
    action_count        int4      NOT NULL,
    artifact_count      int4      NOT NULL,
    upgrade_count       int4      NOT NULL,
    token_number        int4      NULL,
    card_names          varchar   NOT NULL,
    house_names_string  varchar   NOT NULL,
    import_date_time    timestamp NULL,

    expected_amber      float8    NOT NULL,
    amber_control       float8    NOT NULL,
    creature_control    float8    NOT NULL,
    artifact_control    float8    NOT NULL,
    efficiency          float8    NOT NULL,
    recursion           float8    NOT NULL,
    effective_power     int4      NOT NULL,
    disruption          float8    NOT NULL,
    aerc_score          float8    NOT NULL,
    aerc_version        int4      NOT NULL,
    sas_rating          int4      NOT NULL,
    synergy_rating      int4      NOT NULL,
    antisynergy_rating  int4      NOT NULL,

    other               float8    NOT NULL,
    creature_protection float8    NOT NULL,

    for_sale            boolean   NOT NULL,
    for_trade           boolean   NOT NULL,
    listed_on           timestamp NULL,

    deck_id             int8      NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS deck_search_values1
    DROP CONSTRAINT IF EXISTS deck_search_values_1_deck_fk;
ALTER TABLE
    IF EXISTS deck_search_values_1
    ADD
        CONSTRAINT deck_search_values_1_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;

CREATE SEQUENCE IF NOT EXISTS deck_search_values_1_sequence START 1 INCREMENT 1;


CREATE TABLE IF NOT EXISTS deck_search_values2
(
    id                  int8      NOT NULL,

    name                varchar   NOT NULL,
    expansion           int4      NOT NULL,
    maverick_count      int4      NOT NULL,
    raw_amber           int4      NOT NULL,
    bonus_draw          int4      NOT NULL,
    bonus_capture       int4      NOT NULL,
    creature_count      int4      NOT NULL,
    action_count        int4      NOT NULL,
    artifact_count      int4      NOT NULL,
    upgrade_count       int4      NOT NULL,
    token_number        int4      NULL,
    card_names          varchar   NOT NULL,
    house_names_string  varchar   NOT NULL,
    import_date_time    timestamp NULL,

    expected_amber      float8    NOT NULL,
    amber_control       float8    NOT NULL,
    creature_control    float8    NOT NULL,
    artifact_control    float8    NOT NULL,
    efficiency          float8    NOT NULL,
    recursion           float8    NOT NULL,
    effective_power     int4      NOT NULL,
    disruption          float8    NOT NULL,
    aerc_score          float8    NOT NULL,
    aerc_version        int4      NOT NULL,
    sas_rating          int4      NOT NULL,
    synergy_rating      int4      NOT NULL,
    antisynergy_rating  int4      NOT NULL,

    other               float8    NOT NULL,
    creature_protection float8    NOT NULL,

    for_sale            boolean   NOT NULL,
    for_trade           boolean   NOT NULL,
    listed_on           timestamp NULL,

    deck_id             int8      NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS deck_search_values2
    DROP CONSTRAINT IF EXISTS deck_search_values_2_deck_fk;
ALTER TABLE
    IF EXISTS deck_search_values_2
    ADD
        CONSTRAINT deck_search_values_2_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;

CREATE SEQUENCE IF NOT EXISTS deck_search_values_2_sequence START 1 INCREMENT 1;
