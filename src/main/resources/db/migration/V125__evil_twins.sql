ALTER TABLE deck
    ADD COLUMN evil_twin BOOLEAN;

CREATE INDEX evil_twin_deck_idx ON deck(evil_twin);
