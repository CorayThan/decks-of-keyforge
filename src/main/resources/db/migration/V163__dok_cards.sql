DROP TYPE IF EXISTS house;
CREATE TYPE house AS enum (
    'Brobnar',
    'Dis',
    'Ekwidon',
    'Geistoid',
    'Keyraken',
    'Logos',
    'Mars',
    'Sanctum',
    'Saurian',
    'Shadows',
    'StarAlliance',
    'Unfathomable',
    'Untamed'
    );

CREATE TABLE IF NOT EXISTS dok_card
(
    id             INT8      NOT NULL,
    card_title     VARCHAR   NOT NULL,
    card_title_url varchar   NOT NULL,
    houses         house[]   NOT NULL,
    card_type      VARCHAR   NOT NULL,
    rarity         VARCHAR   NOT NULL,
    amber          INT4      NOT NULL,
    power          INT4      NOT NULL,
    armor          INT4      NOT NULL,
    big            BOOL      NOT NULL,
    token          BOOL      NOT NULL,
    evil_twin      BOOL      NOT NULL,
    traits         VARCHAR[] NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE dok_card
    ADD CONSTRAINT dok_card_title_url_uk UNIQUE (card_title_url);

CREATE TABLE IF NOT EXISTS dok_card_expansion
(
    id          INT8    NOT NULL,
    card_number VARCHAR NOT NULL,
    expansion   VARCHAR NOT NULL,
    wins        INT4    NOT NULL,
    losses      INT4    NOT NULL,
    card_id     INT8    NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE dok_card_expansion
    ADD CONSTRAINT dok_card_expansion_card_num_expan_uc UNIQUE (card_number, expansion);

ALTER TABLE IF EXISTS extra_card_info
    ADD COLUMN dok_card_id int8 NULL;

ALTER TABLE IF EXISTS extra_card_info
    ADD COLUMN card_name_url varchar NULL;

ALTER TABLE
    IF EXISTS extra_card_info
    ADD
        CONSTRAINT extra_card_info_dok_card_fk FOREIGN KEY (dok_card_id) REFERENCES dok_card;

ALTER TABLE
    IF EXISTS dok_card_expansion
    ADD
        CONSTRAINT dok_card_dok_card_expansion_fk FOREIGN KEY (card_id) REFERENCES dok_card;

CREATE SEQUENCE IF NOT EXISTS dok_card_sequence START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS dok_card_expansion_sequence START 1 INCREMENT 1;
