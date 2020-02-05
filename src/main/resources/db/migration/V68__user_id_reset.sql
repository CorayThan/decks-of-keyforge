ALTER TABLE password_reset_code
    ADD COLUMN user_id UUID;

ALTER TABLE
    password_reset_code
    ADD
        CONSTRAINT password_reset_code_key_user_fk FOREIGN KEY (user_id) REFERENCES key_user;

