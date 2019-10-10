ALTER TABLE IF EXISTS card
    ADD COLUMN extra_info_id INT8;

CREATE TABLE card_identifier (
    id INT8 NOT NULL,
    card_number VARCHAR(255),
    expansion VARCHAR(50),
    PRIMARY KEY (id)
);

CREATE TABLE extra_card_info (
    id INT8 NOT NULL,
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

CREATE TABLE extra_card_info_card_numbers (
    extra_card_info_id INT8 NOT NULL,
    card_numbers_id INT8 NOT NULL
);

CREATE TABLE extra_card_info_synergies (
    extra_card_info_id INT8 NOT NULL,
    synergies_id UUID NOT NULL
);

CREATE TABLE extra_card_info_traits (
    extra_card_info_id INT8 NOT NULL,
    traits_id UUID NOT NULL
);


ALTER TABLE IF EXISTS extra_card_info_card_numbers
    ADD CONSTRAINT UK_extra_card_info_card_numbers_card_numbers_id UNIQUE (card_numbers_id);
ALTER TABLE IF EXISTS extra_card_info_synergies
    ADD CONSTRAINT UK_extra_card_info_synergies_synergies_id UNIQUE (synergies_id);
ALTER TABLE IF EXISTS extra_card_info_traits
    ADD CONSTRAINT UK_extra_card_info_traits_traits_id UNIQUE (traits_id);
ALTER TABLE IF EXISTS card
    ADD CONSTRAINT FK_extra_card_info_extra_info_id FOREIGN KEY (extra_info_id) REFERENCES extra_card_info;
ALTER TABLE IF EXISTS extra_card_info_card_numbers
    ADD CONSTRAINT FK_extra_card_info_card_numbers_card_numbers_id FOREIGN KEY (card_numbers_id) REFERENCES card_identifier;
ALTER TABLE IF EXISTS extra_card_info_card_numbers
    ADD CONSTRAINT FK_extra_card_info_card_numbers_extra_card_info_id FOREIGN KEY (extra_card_info_id) REFERENCES extra_card_info;
ALTER TABLE IF EXISTS extra_card_info_synergies
    ADD CONSTRAINT FK_extra_card_info_synergies_synergies_id FOREIGN KEY (synergies_id) REFERENCES syn_trait_value;
ALTER TABLE IF EXISTS extra_card_info_synergies
    ADD CONSTRAINT FK_extra_card_info_synergies_extra_card_info_id FOREIGN KEY (extra_card_info_id) REFERENCES extra_card_info;
ALTER TABLE IF EXISTS extra_card_info_traits
    ADD CONSTRAINT FK_extra_card_info_traits_traits_id FOREIGN KEY (traits_id) REFERENCES syn_trait_value;
ALTER TABLE IF EXISTS extra_card_info_traits
    ADD CONSTRAINT FK_extra_card_info_traits_extra_card_info_id FOREIGN KEY (extra_card_info_id) REFERENCES extra_card_info;
