ALTER TABLE spoiler
    ADD COLUMN reprint BOOLEAN;

UPDATE spoiler
SET reprint = FALSE;