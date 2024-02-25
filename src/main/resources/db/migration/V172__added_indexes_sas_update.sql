ALTER TABLE sas_version
    ADD COLUMN added_indexes bool DEFAULT FALSE;

UPDATE sas_version
SET added_indexes = TRUE
WHERE sas_update_completed_timestamp IS NOT NULL;

CREATE TABLE IF NOT EXISTS card_notes
(
    id                 UUID      NOT NULL,
    note               VARCHAR   NOT NULL,
    card_id            int8      NOT NULL,
    user_id            UUID      NOT NULL,
    approved           bool      NOT NULL,
    extra_info_version int4      NOT NULL,
    created            TIMESTAMP NOT NULL,
    updated            TIMESTAMP NULL,
    PRIMARY KEY (id)
);

ALTER TABLE card_notes
    ADD CONSTRAINT card_notes_dok_card_fk FOREIGN KEY (card_id) REFERENCES dok_card;

ALTER TABLE card_notes
    ADD CONSTRAINT card_notes_key_user_fk FOREIGN KEY (user_id) REFERENCES key_user;
