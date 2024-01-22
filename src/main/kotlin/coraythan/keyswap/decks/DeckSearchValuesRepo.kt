package coraythan.keyswap.decks

import coraythan.keyswap.decks.models.DeckSearchValues1
import coraythan.keyswap.decks.models.DeckSearchValues2
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.transaction.annotation.Transactional

@Transactional
interface DeckSearchValues1Repo : CrudRepository<DeckSearchValues1, Long> {

    @Modifying
    @Query(
        value = """
            CREATE INDEX dsv1_sas_asc_id_idx ON deck_search_values1 (sas_rating, id);
            CREATE INDEX dsv1_sas_desc_id_idx ON deck_search_values1 (sas_rating DESC, id);
            CREATE INDEX dsv1_import_date_time_asc_id_idx ON deck_search_values1 (import_date_time, id);
            CREATE INDEX dsv1_import_date_time_desc_id_idx ON deck_search_values1 (import_date_time DESC, id);
            CREATE INDEX dsv1_deck_listed_on_idx ON deck_search_values1 (listed_on DESC, id);
            
            CREATE INDEX dsv1_deck_name_lower ON deck_search_values1 USING gin (LOWER(name) gin_trgm_ops);
            CREATE INDEX dsv1_expansion_idx ON deck_search_values1 (expansion);
            CREATE INDEX dsv1_maverick_count_idx ON deck_search_values1 (maverick_count);
            CREATE INDEX dsv1_raw_amber_idx ON deck_search_values1 (raw_amber);
            CREATE INDEX dsv1_bonus_draw_idx ON deck_search_values1 (bonus_draw);
            CREATE INDEX dsv1_bonus_capture_idx ON deck_search_values1 (bonus_capture);
            CREATE INDEX dsv1_creature_count_idx ON deck_search_values1 (creature_count);
            CREATE INDEX dsv1_action_count_idx ON deck_search_values1 (action_count);
            CREATE INDEX dsv1_artifact_count_idx ON deck_search_values1 (artifact_count);
            CREATE INDEX dsv1_upgrade_count_idx ON deck_search_values1 (upgrade_count);
            CREATE INDEX dsv1_token_number_idx ON deck_search_values1 (token_number);
            CREATE INDEX dsv1_card_names_idx ON deck_search_values1 USING gin (card_names gin_trgm_ops);
            CREATE INDEX dsv1_house_names_string_idx ON deck_search_values1 USING gin (house_names_string gin_trgm_ops);
            
            CREATE INDEX dsv1_sas_rating_idx ON deck_search_values1 (sas_rating);
            CREATE INDEX dsv1_synergy_rating_idx ON deck_search_values1 (synergy_rating);
            CREATE INDEX dsv1_antisynergy_rating_idx ON deck_search_values1 (antisynergy_rating);
            CREATE INDEX dsv1_amber_control_idx ON deck_search_values1 (amber_control);
            CREATE INDEX dsv1_expected_amber_idx ON deck_search_values1 (expected_amber);
            CREATE INDEX dsv1_artifact_control_idx ON deck_search_values1 (artifact_control);
            CREATE INDEX dsv1_creature_control_idx ON deck_search_values1 (creature_control);
            CREATE INDEX dsv1_efficiency_idx ON deck_search_values1 (efficiency);
            CREATE INDEX dsv1_recursion_idx ON deck_search_values1 (recursion);
            CREATE INDEX dsv1_disruption_idx ON deck_search_values1 (disruption);
            CREATE INDEX dsv1_effective_power_idx ON deck_search_values1 (effective_power);
            
            CREATE INDEX dsv1_for_sale_idx ON deck_search_values1 (for_sale);
            CREATE INDEX dsv1_for_trade_idx ON deck_search_values1 (for_trade);
            
            CREATE INDEX dsv1_deck_id_idx ON deck_search_values1 (deck_id);
        """,
        nativeQuery = true
    )
    fun addIndexes()

    @Modifying
    @Query(
        value = """
            DROP INDEX dsv1_sas_asc_id_idx;
            DROP INDEX dsv1_sas_desc_id_idx;
            DROP INDEX dsv1_import_date_time_asc_id_idx;
            DROP INDEX dsv1_import_date_time_desc_id_idx;
            DROP INDEX dsv1_deck_listed_on_idx;
            
            DROP INDEX dsv1_deck_name_lower;
            DROP INDEX dsv1_expansion_idx;
            DROP INDEX dsv1_maverick_count_idx;
            DROP INDEX dsv1_raw_amber_idx;
            DROP INDEX dsv1_bonus_draw_idx;
            DROP INDEX dsv1_bonus_capture_idx;
            DROP INDEX dsv1_creature_count_idx;
            DROP INDEX dsv1_action_count_idx;
            DROP INDEX dsv1_artifact_count_idx;
            DROP INDEX dsv1_upgrade_count_idx;
            DROP INDEX dsv1_token_number_idx;
            DROP INDEX dsv1_card_names_idx;
            DROP INDEX dsv1_house_names_string_idx;
            
            DROP INDEX dsv1_sas_rating_idx;
            DROP INDEX dsv1_synergy_rating_idx;
            DROP INDEX dsv1_antisynergy_rating_idx;
            DROP INDEX dsv1_amber_control_idx;
            DROP INDEX dsv1_expected_amber_idx;
            DROP INDEX dsv1_artifact_control_idx;
            DROP INDEX dsv1_creature_control_idx;
            DROP INDEX dsv1_efficiency_idx;
            DROP INDEX dsv1_recursion_idx;
            DROP INDEX dsv1_disruption_idx;
            DROP INDEX dsv1_effective_power_idx;
            
            DROP INDEX dsv1_for_sale_idx;
            DROP INDEX dsv1_for_trade_idx;
            DROP INDEX dsv1_deck_id_idx;
        """,
        nativeQuery = true
    )
    fun dropIndexes()
}

@Transactional
interface DeckSearchValues2Repo : CrudRepository<DeckSearchValues2, Long> {

    @Modifying
    @Query(
        value = """
            CREATE INDEX dsv2_sas_asc_id_idx ON deck_search_values2 (sas_rating, id);
            CREATE INDEX dsv2_sas_desc_id_idx ON deck_search_values2 (sas_rating DESC, id);
            CREATE INDEX dsv2_import_date_time_asc_id_idx ON deck_search_values2 (import_date_time, id);
            CREATE INDEX dsv2_import_date_time_desc_id_idx ON deck_search_values2 (import_date_time DESC, id);
            CREATE INDEX dsv2_deck_listed_on_idx ON deck_search_values2 (listed_on DESC, id);
            
            CREATE INDEX dsv2_deck_name_lower ON deck_search_values2 USING gin (LOWER(name) gin_trgm_ops);
            CREATE INDEX dsv2_expansion_idx ON deck_search_values2 (expansion);
            CREATE INDEX dsv2_maverick_count_idx ON deck_search_values2 (maverick_count);
            CREATE INDEX dsv2_raw_amber_idx ON deck_search_values2 (raw_amber);
            CREATE INDEX dsv2_bonus_draw_idx ON deck_search_values2 (bonus_draw);
            CREATE INDEX dsv2_bonus_capture_idx ON deck_search_values2 (bonus_capture);
            CREATE INDEX dsv2_creature_count_idx ON deck_search_values2 (creature_count);
            CREATE INDEX dsv2_action_count_idx ON deck_search_values2 (action_count);
            CREATE INDEX dsv2_artifact_count_idx ON deck_search_values2 (artifact_count);
            CREATE INDEX dsv2_upgrade_count_idx ON deck_search_values2 (upgrade_count);
            CREATE INDEX dsv2_token_number_idx ON deck_search_values2 (token_number);
            CREATE INDEX dsv2_card_names_idx ON deck_search_values2 USING gin (card_names gin_trgm_ops);
            CREATE INDEX dsv2_house_names_string_idx ON deck_search_values2 USING gin (house_names_string gin_trgm_ops);
            
            CREATE INDEX dsv2_sas_rating_idx ON deck_search_values2 (sas_rating);
            CREATE INDEX dsv2_synergy_rating_idx ON deck_search_values2 (synergy_rating);
            CREATE INDEX dsv2_antisynergy_rating_idx ON deck_search_values2 (antisynergy_rating);
            CREATE INDEX dsv2_amber_control_idx ON deck_search_values2 (amber_control);
            CREATE INDEX dsv2_expected_amber_idx ON deck_search_values2 (expected_amber);
            CREATE INDEX dsv2_artifact_control_idx ON deck_search_values2 (artifact_control);
            CREATE INDEX dsv2_creature_control_idx ON deck_search_values2 (creature_control);
            CREATE INDEX dsv2_efficiency_idx ON deck_search_values2 (efficiency);
            CREATE INDEX dsv2_recursion_idx ON deck_search_values2 (recursion);
            CREATE INDEX dsv2_disruption_idx ON deck_search_values2 (disruption);
            CREATE INDEX dsv2_effective_power_idx ON deck_search_values2 (effective_power);
            
            CREATE INDEX dsv2_for_sale_idx ON deck_search_values2 (for_sale);
            CREATE INDEX dsv2_for_trade_idx ON deck_search_values2 (for_trade);
            
            CREATE INDEX dsv2_deck_id_idx ON deck_search_values2 (deck_id);
        """,
        nativeQuery = true
    )
    fun addIndexes()

    @Modifying
    @Query(
        value = """
            DROP INDEX dsv2_sas_asc_id_idx;
            DROP INDEX dsv2_sas_desc_id_idx;
            DROP INDEX dsv2_import_date_time_asc_id_idx;
            DROP INDEX dsv2_import_date_time_desc_id_idx;
            DROP INDEX dsv2_deck_listed_on_idx;
            
            DROP INDEX dsv2_deck_name_lower;
            DROP INDEX dsv2_expansion_idx;
            DROP INDEX dsv2_maverick_count_idx;
            DROP INDEX dsv2_raw_amber_idx;
            DROP INDEX dsv2_bonus_draw_idx;
            DROP INDEX dsv2_bonus_capture_idx;
            DROP INDEX dsv2_creature_count_idx;
            DROP INDEX dsv2_action_count_idx;
            DROP INDEX dsv2_artifact_count_idx;
            DROP INDEX dsv2_upgrade_count_idx;
            DROP INDEX dsv2_token_number_idx;
            DROP INDEX dsv2_card_names_idx;
            DROP INDEX dsv2_house_names_string_idx;
            
            DROP INDEX dsv2_sas_rating_idx;
            DROP INDEX dsv2_synergy_rating_idx;
            DROP INDEX dsv2_antisynergy_rating_idx;
            DROP INDEX dsv2_amber_control_idx;
            DROP INDEX dsv2_expected_amber_idx;
            DROP INDEX dsv2_artifact_control_idx;
            DROP INDEX dsv2_creature_control_idx;
            DROP INDEX dsv2_efficiency_idx;
            DROP INDEX dsv2_recursion_idx;
            DROP INDEX dsv2_disruption_idx;
            DROP INDEX dsv2_effective_power_idx;
            
            DROP INDEX dsv2_for_sale_idx;
            DROP INDEX dsv2_for_trade_idx;
            DROP INDEX dsv2_deck_id_idx;
        """,
        nativeQuery = true
    )
    fun dropIndexes()
}
