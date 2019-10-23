UPDATE spoiler
SET house = 'Saurian'
WHERE house = 'SaurianRepublic';

UPDATE spoiler
SET card_title = 'Ortannu’s Binding'
WHERE id = 1327209;
UPDATE spoiler
SET card_title = 'Nature’s Call'
WHERE id = 1327202;
UPDATE spoiler
SET card_title = 'Po’s Pixies'
WHERE id = 1327216;
UPDATE spoiler
SET card_title = 'Seismo-entangler'
WHERE id = 1327234;

ALTER TABLE deck
    ADD COLUMN anomaly_count INT4;

CREATE INDEX anomaly_count_idx ON deck(anomaly_count);
