ALTER TABLE sas_version
    ALTER COLUMN active_update_table TYPE varchar;

DROP TYPE IF EXISTS active_sas_search_table;

ALTER TABLE deck_sas_values_searchable
    ADD CONSTRAINT deck_id_unique_dsv1_uk UNIQUE (deck_id);
ALTER TABLE deck_sas_values_updatable
    ADD CONSTRAINT deck_id_unique_dsv2_uk UNIQUE (deck_id);
