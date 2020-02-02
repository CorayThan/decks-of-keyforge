TRUNCATE spoiler;

ALTER TABLE spoiler
    ADD COLUMN created_by_id UUID NOT NULL;

ALTER TABLE spoiler
    ADD COLUMN double_card BOOLEAN DEFAULT FALSE NOT NULL;

ALTER TABLE
    IF EXISTS spoiler
    ADD
        CONSTRAINT spoiler_created_by_key_user_fk FOREIGN KEY (created_by_id) REFERENCES key_user;
