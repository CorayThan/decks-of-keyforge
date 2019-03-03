
ALTER TABLE deck ADD COLUMN aerc_score float8;
ALTER TABLE deck ADD COLUMN stats_version int4;

CREATE INDEX deck_aerc_desc_id_idx ON deck (aerc_score desc, id);
CREATE INDEX deck_aerc_asc_id_idx ON deck (aerc_score, id);
CREATE INDEX deck_stats_version_idx ON deck (stats_version);
CREATE INDEX deck_ratings_version_idx ON deck (rating_version);

ALTER TABLE deck_statistics_entity ADD COLUMN version int4;
ALTER TABLE deck_statistics_entity ADD COLUMN complete_date_time timestamp;

UPDATE deck_statistics_entity SET version = 0;
UPDATE deck_statistics_entity SET complete_date_time = NOW();
CREATE INDEX deck_statistics_stats_version_idx ON deck_statistics_entity (version);

ALTER TABLE deck_statistics_entity ADD CONSTRAINT deck_statistics_entity_version_uq UNIQUE (version);

DROP TABLE IF EXISTS deck_card;
