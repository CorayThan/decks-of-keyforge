CREATE TYPE active_sas_search_table AS enum ('DSV1', 'DSV2');

CREATE TABLE sas_version
(
    id                             INT8                    NOT NULL,
    active_search_table            active_sas_search_table NOT NULL,
    version                        INT4                    NOT NULL,
    created_timestamp              TIMESTAMP               NOT NULL,
    sas_update_completed_timestamp TIMESTAMP               NULL,
    PRIMARY KEY (id)
);

CREATE SEQUENCE IF NOT EXISTS sas_version_sequence START 1 INCREMENT 1;

INSERT INTO sas_version (id, active_search_table, version, created_timestamp, sas_update_completed_timestamp)
VALUES (NEXTVAL('sas_version_sequence'), 'DSV1', 43, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

CREATE INDEX IF NOT EXISTS dsv1_sas_asc_id_idx ON deck_search_values1 (sas_rating, id);
CREATE INDEX IF NOT EXISTS dsv1_sas_desc_id_idx ON deck_search_values1 (sas_rating DESC, id);
CREATE INDEX IF NOT EXISTS dsv1_import_date_time_asc_id_idx ON deck_search_values1 (import_date_time, id);
CREATE INDEX IF NOT EXISTS dsv1_import_date_time_desc_id_idx ON deck_search_values1 (import_date_time DESC, id);
CREATE INDEX IF NOT EXISTS dsv1_deck_listed_on_idx ON deck_search_values1 (listed_on DESC, id);

CREATE INDEX IF NOT EXISTS dsv1_deck_name_lower ON deck_search_values1 USING gin (LOWER(name) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS dsv1_expansion_idx ON deck_search_values1 (expansion);
CREATE INDEX IF NOT EXISTS dsv1_maverick_count_idx ON deck_search_values1 (maverick_count);
CREATE INDEX IF NOT EXISTS dsv1_raw_amber_idx ON deck_search_values1 (raw_amber);
CREATE INDEX IF NOT EXISTS dsv1_bonus_draw_idx ON deck_search_values1 (bonus_draw);
CREATE INDEX IF NOT EXISTS dsv1_bonus_capture_idx ON deck_search_values1 (bonus_capture);
CREATE INDEX IF NOT EXISTS dsv1_creature_count_idx ON deck_search_values1 (creature_count);
CREATE INDEX IF NOT EXISTS dsv1_action_count_idx ON deck_search_values1 (action_count);
CREATE INDEX IF NOT EXISTS dsv1_artifact_count_idx ON deck_search_values1 (artifact_count);
CREATE INDEX IF NOT EXISTS dsv1_upgrade_count_idx ON deck_search_values1 (upgrade_count);
CREATE INDEX IF NOT EXISTS dsv1_token_number_idx ON deck_search_values1 (token_number);
CREATE INDEX IF NOT EXISTS dsv1_card_names_idx ON deck_search_values1 USING gin (card_names gin_trgm_ops);
CREATE INDEX IF NOT EXISTS dsv1_house_names_string_idx ON deck_search_values1 USING gin (house_names_string gin_trgm_ops);

CREATE INDEX IF NOT EXISTS dsv1_sas_rating_idx ON deck_search_values1 (sas_rating);
CREATE INDEX IF NOT EXISTS dsv1_synergy_rating_idx ON deck_search_values1 (synergy_rating);
CREATE INDEX IF NOT EXISTS dsv1_antisynergy_rating_idx ON deck_search_values1 (antisynergy_rating);
CREATE INDEX IF NOT EXISTS dsv1_amber_control_idx ON deck_search_values1 (amber_control);
CREATE INDEX IF NOT EXISTS dsv1_expected_amber_idx ON deck_search_values1 (expected_amber);
CREATE INDEX IF NOT EXISTS dsv1_artifact_control_idx ON deck_search_values1 (artifact_control);
CREATE INDEX IF NOT EXISTS dsv1_creature_control_idx ON deck_search_values1 (creature_control);
CREATE INDEX IF NOT EXISTS dsv1_efficiency_idx ON deck_search_values1 (efficiency);
CREATE INDEX IF NOT EXISTS dsv1_recursion_idx ON deck_search_values1 (recursion);
CREATE INDEX IF NOT EXISTS dsv1_disruption_idx ON deck_search_values1 (disruption);
CREATE INDEX IF NOT EXISTS dsv1_effective_power_idx ON deck_search_values1 (effective_power);

CREATE INDEX IF NOT EXISTS dsv1_for_sale_idx ON deck_search_values1 (for_sale);
CREATE INDEX IF NOT EXISTS dsv1_for_trade_idx ON deck_search_values1 (for_trade);

CREATE INDEX IF NOT EXISTS dsv1_deck_id_idx ON deck_search_values1 (deck_id);
