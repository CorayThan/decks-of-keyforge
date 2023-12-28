ALTER TABLE card
    DROP COLUMN IF EXISTS expansion_enum;

DELETE
FROM deck_statistics_entity
WHERE deck_stats_json IS NULL;

ALTER TABLE deck_statistics_entity
    ALTER COLUMN deck_stats_json SET NOT NULL;

