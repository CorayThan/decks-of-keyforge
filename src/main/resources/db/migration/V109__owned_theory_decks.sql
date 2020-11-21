ALTER TABLE theoretical_deck
    ADD COLUMN creator_id UUID;

ALTER TABLE theoretical_deck
    ADD CONSTRAINT theoretical_deck_creator_id_fk FOREIGN KEY (creator_id) REFERENCES key_user;

CREATE INDEX creator_id_idx ON theoretical_deck(creator_id);

ALTER TABLE ktag
    ADD COLUMN public_edits BOOLEAN;

UPDATE ktag
SET public_edits = FALSE;

ALTER TABLE ktag
    ALTER COLUMN public_edits SET NOT NULL;
