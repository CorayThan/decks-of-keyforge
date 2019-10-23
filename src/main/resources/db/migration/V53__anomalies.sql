ALTER TABLE card
    ADD COLUMN anomaly BOOLEAN;

UPDATE card
SET anomaly = FALSE;