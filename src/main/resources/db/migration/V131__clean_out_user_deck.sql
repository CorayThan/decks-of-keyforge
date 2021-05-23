ALTER TABLE user_deck
    RENAME TO deck_note;

ALTER TABLE deck_note
    DROP COLUMN owned_by;
ALTER TABLE deck_note
    DROP COLUMN team_id;
ALTER TABLE deck_note
    DROP COLUMN migrated;
ALTER TABLE deck_note
    DROP COLUMN wishlist;
ALTER TABLE deck_note
    DROP COLUMN funny;
