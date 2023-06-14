CREATE TABLE card_edit_history
(
    id                               UUID           NOT NULL,
    editor_id                        UUID           NOT NULL,
    extra_card_info_id               UUID           NOT NULL,
    before_edit_extra_card_info_json VARCHAR(10000) NOT NULL,
    created                          TIMESTAMP      NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE card_edit_history
    ADD CONSTRAINT card_edit_history_editor_id_fk FOREIGN KEY (editor_id) REFERENCES key_user;

ALTER TABLE card_edit_history
    ADD CONSTRAINT card_edit_history_extra_card_info_id_fk FOREIGN KEY (extra_card_info_id) REFERENCES extra_card_info;
