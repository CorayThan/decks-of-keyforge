ALTER TABLE key_user
    ADD COLUMN display_crucible_tracker_wins BOOLEAN;

UPDATE key_user
SET display_crucible_tracker_wins = FALSE;