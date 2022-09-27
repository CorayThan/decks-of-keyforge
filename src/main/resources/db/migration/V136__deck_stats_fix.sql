ALTER TABLE deck_statistics_entity
    ADD COLUMN deck_stats_json TEXT;

UPDATE deck_statistics_entity
SET deck_stats_json = CONVERT_FROM(lo_get(deck_stats::oid), 'UTF8');

DELETE
FROM deck_statistics_entity
WHERE complete_date_time IS NULL
   OR deck_stats_json = '';
