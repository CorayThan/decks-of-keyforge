ALTER TABLE key_user
    ADD COLUMN manual_patreon_tier CHARACTER VARYING(50);
ALTER TABLE key_user
    ADD COLUMN remove_manual_patreon_tier TIMESTAMP;