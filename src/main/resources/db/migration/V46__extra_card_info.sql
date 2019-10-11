ALTER TABLE IF EXISTS card
    ADD COLUMN extra_info_id INT8;

CREATE TABLE card_identifier (
    id INT8 NOT NULL,
    card_number VARCHAR(255),
    expansion VARCHAR(255),
    info_id INT8,
    PRIMARY KEY (id)
);

CREATE TABLE extra_card_info (
    id INT8 NOT NULL,
    rating FLOAT8 NOT NULL,
    amber_control FLOAT8 NOT NULL,
    amber_control_max FLOAT8,
    amber_protection FLOAT8 NOT NULL,
    amber_protection_max FLOAT8,
    artifact_control FLOAT8 NOT NULL,
    artifact_control_max FLOAT8,
    creature_control FLOAT8 NOT NULL,
    creature_control_max FLOAT8,
    disruption FLOAT8 NOT NULL,
    disruption_max FLOAT8,
    effective_power INT4 NOT NULL,
    effective_power_max FLOAT8,
    efficiency FLOAT8 NOT NULL,
    efficiency_max FLOAT8,
    expected_amber FLOAT8 NOT NULL,
    expected_amber_max FLOAT8,
    house_cheating FLOAT8 NOT NULL,
    house_cheating_max FLOAT8,
    other FLOAT8 NOT NULL,
    other_max FLOAT8,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS syn_trait_value
    ADD COLUMN synergy_info_id INT8;
ALTER TABLE IF EXISTS syn_trait_value
    ADD COLUMN trait_info_id INT8;
ALTER TABLE IF EXISTS syn_trait_value
    ALTER COLUMN type TYPE VARCHAR(255);
ALTER TABLE IF EXISTS syn_trait_value
    ALTER COLUMN trait TYPE VARCHAR(255);

ALTER TABLE IF EXISTS card
    ADD CONSTRAINT FK_card_extra_info_id FOREIGN KEY (extra_info_id) REFERENCES extra_card_info;
ALTER TABLE IF EXISTS card_identifier
    ADD CONSTRAINT FK_card_identifier_info_id FOREIGN KEY (info_id) REFERENCES extra_card_info;
ALTER TABLE IF EXISTS syn_trait_value
    ADD CONSTRAINT FK_syn_trait_value_synergy_info_id FOREIGN KEY (synergy_info_id) REFERENCES extra_card_info;
ALTER TABLE IF EXISTS syn_trait_value
    ADD CONSTRAINT FK_syn_trait_value_trait_info_id FOREIGN KEY (trait_info_id) REFERENCES extra_card_info;

ALTER TABLE IF EXISTS card
    ADD COLUMN expansion_enum VARCHAR(255);

UPDATE card
SET expansion_enum = 'CALL_OF_THE_ARCHONS'
WHERE expansion = 341;
UPDATE card
SET expansion_enum = 'AGE_OF_ASCENSION'
WHERE expansion = 435;
UPDATE card
SET expansion_enum = 'WORLDS_COLLIDE'
WHERE expansion = 1;
