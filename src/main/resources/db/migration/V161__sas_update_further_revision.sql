ALTER TABLE deck_search_values1
    DROP COLUMN IF EXISTS for_sale;
ALTER TABLE deck_search_values1
    DROP COLUMN IF EXISTS for_trade;
ALTER TABLE deck_search_values1
    DROP COLUMN IF EXISTS listed_on;

ALTER TABLE deck_search_values2
    DROP COLUMN IF EXISTS for_sale;
ALTER TABLE deck_search_values2
    DROP COLUMN IF EXISTS for_trade;
ALTER TABLE deck_search_values2
    DROP COLUMN IF EXISTS listed_on;

ALTER TABLE sas_version
    ADD COLUMN sas_scores_updated bool NULL;
UPDATE sas_version
SET sas_scores_updated = TRUE;
ALTER TABLE sas_version
    ALTER COLUMN sas_scores_updated SET NOT NULL;

ALTER TABLE deck_search_values1
    RENAME TO deck_sas_values_searchable;
ALTER TABLE deck_search_values2
    RENAME TO deck_sas_values_updatable;

ALTER TABLE sas_version
    RENAME COLUMN active_search_table TO active_update_table;
