ALTER TABLE spoiler
    ADD COLUMN anomaly BOOLEAN;

UPDATE spoiler
SET anomaly = FALSE;

ALTER TABLE spoiler
    ALTER COLUMN house DROP NOT NULL;