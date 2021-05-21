ALTER TABLE tournament
    ADD COLUMN organizer_added_decks_only BOOLEAN;
UPDATE tournament
SET organizer_added_decks_only = FALSE;
ALTER TABLE tournament
    ALTER COLUMN organizer_added_decks_only SET NOT NULL;

ALTER TABLE tournament
    ADD COLUMN show_decks_to_all_players BOOLEAN;
UPDATE tournament
SET show_decks_to_all_players = TRUE;
ALTER TABLE tournament
    ALTER COLUMN show_decks_to_all_players SET NOT NULL;
