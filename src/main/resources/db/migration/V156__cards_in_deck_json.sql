ALTER TABLE deck
    ADD COLUMN IF NOT EXISTS cards json;
