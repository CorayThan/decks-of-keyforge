ALTER TABLE key_user
    ADD COLUMN deck_count INT4 DEFAULT 0 NOT NULL,
    ADD COLUMN for_sale_count INT4 DEFAULT 0 NOT NULL,
    ADD COLUMN top_sas_average INT4 DEFAULT 0 NOT NULL,
    ADD COLUMN total_power INT4 DEFAULT 0 NOT NULL,
    ADD COLUMN total_chains INT4 DEFAULT 0 NOT NULL,
    ADD COLUMN high_sas INT4 DEFAULT 0 NOT NULL,
    ADD COLUMN low_sas INT4 DEFAULT 0 NOT NULL,
    ADD COLUMN mavericks INT4 DEFAULT 0 NOT NULL,
    ADD COLUMN anomalies INT4 DEFAULT 0 NOT NULL,
    ADD COLUMN update_stats BOOLEAN DEFAULT TRUE NOT NULL;

CREATE INDEX user_deck_count_desc_id_idx ON key_user(deck_count DESC, id);
CREATE INDEX user_top_sas_average_desc_id_idx ON key_user(top_sas_average DESC, id);
CREATE INDEX user_total_power_desc_id_idx ON key_user(total_power DESC, id);
CREATE INDEX user_total_chains_desc_id_idx ON key_user(total_chains DESC, id);
CREATE INDEX user_for_sale_desc_id_idx ON key_user(for_sale_count DESC, id);
CREATE INDEX user_high_sas_desc_id_idx ON key_user(high_sas DESC, id);
CREATE INDEX user_low_sas_desc_id_idx ON key_user(low_sas DESC, id);
CREATE INDEX user_mavericks_desc_id_idx ON key_user(mavericks DESC, id);
CREATE INDEX user_anomalies_desc_id_idx ON key_user(anomalies DESC, id);

CREATE INDEX user_username_idx ON key_user(username);
CREATE INDEX user_country_idx ON key_user(country);
CREATE INDEX user_patreon_idx ON key_user(patreon_tier);
CREATE INDEX user_update_stats_idx ON key_user(update_stats);
CREATE INDEX ON key_user USING gin(lower(username) gin_trgm_ops);
