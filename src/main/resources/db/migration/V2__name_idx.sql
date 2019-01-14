
drop index name_idx;

CREATE EXTENSION pg_trgm;
CREATE INDEX ON deck USING gin (lower(name) gin_trgm_ops);

