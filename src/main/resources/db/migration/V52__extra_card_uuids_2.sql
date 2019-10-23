ALTER TABLE card
    DROP CONSTRAINT FK_card_extra_info_id;
ALTER TABLE card
    DROP COLUMN extra_info_id;

ALTER TABLE card_identifier
    ADD COLUMN info_uuid_id UUID;

ALTER TABLE syn_trait_value
    ADD COLUMN trait_info_uuid_id UUID;

ALTER TABLE syn_trait_value
    ADD COLUMN synergy_info_uuid_id UUID;

UPDATE card_identifier
SET info_uuid_id = extra_card_info.uuid_id
FROM extra_card_info
WHERE card_identifier.info_id = extra_card_info.id;

UPDATE syn_trait_value
SET trait_info_uuid_id = extra_card_info.uuid_id
FROM extra_card_info
WHERE syn_trait_value.trait_info_id = extra_card_info.id;

UPDATE syn_trait_value
SET synergy_info_uuid_id = extra_card_info.uuid_id
FROM extra_card_info
WHERE syn_trait_value.synergy_info_id = extra_card_info.id;

ALTER TABLE card_identifier
    DROP CONSTRAINT fk_card_identifier_info_id;

ALTER TABLE syn_trait_value
    DROP CONSTRAINT fk_syn_trait_value_synergy_info_id;

ALTER TABLE syn_trait_value
    DROP CONSTRAINT fk_syn_trait_value_trait_info_id;

ALTER TABLE card_identifier
    DROP CONSTRAINT card_identifier_pkey;
ALTER TABLE extra_card_info
    DROP CONSTRAINT extra_card_info_pkey;

ALTER TABLE card_identifier
    ADD PRIMARY KEY (uuid_id);
ALTER TABLE extra_card_info
    ADD PRIMARY KEY (uuid_id);

ALTER TABLE card_identifier
    DROP COLUMN id;
ALTER TABLE extra_card_info
    DROP COLUMN id;

ALTER TABLE card_identifier
    RENAME COLUMN uuid_id TO id;
ALTER TABLE extra_card_info
    RENAME COLUMN uuid_id TO id;

ALTER TABLE card_identifier
    DROP COLUMN info_id;
ALTER TABLE syn_trait_value
    DROP COLUMN trait_info_id;
ALTER TABLE syn_trait_value
    DROP COLUMN synergy_info_id;

ALTER TABLE card_identifier
    RENAME COLUMN info_uuid_id TO info_id;
ALTER TABLE syn_trait_value
    RENAME COLUMN trait_info_uuid_id TO trait_info_id;
ALTER TABLE syn_trait_value
    RENAME COLUMN synergy_info_uuid_id TO synergy_info_id;

ALTER TABLE card_identifier
    ADD CONSTRAINT fk_card_identifier_info_uuid
        FOREIGN KEY (info_id) REFERENCES extra_card_info(id);

ALTER TABLE syn_trait_value
    ADD CONSTRAINT fk_syn_trait_value_trait_info_uuid
        FOREIGN KEY (trait_info_id) REFERENCES extra_card_info(id);

ALTER TABLE syn_trait_value
    ADD CONSTRAINT fk_syn_trait_value_synergy_info_uuid
        FOREIGN KEY (synergy_info_id) REFERENCES extra_card_info(id);
