ALTER TABLE extra_card_info
    ALTER COLUMN dok_card_id SET NOT NULL;
ALTER TABLE extra_card_info
    ALTER COLUMN card_name_url SET NOT NULL;

ALTER TABLE dok_card
    ADD COLUMN card_text varchar NULL;
ALTER TABLE dok_card
    ADD COLUMN flavor_text varchar NULL;

ALTER TABLE deck
    DROP COLUMN IF EXISTS card_names;
ALTER TABLE deck
    DROP COLUMN IF EXISTS refreshed_bonus_icons;
ALTER TABLE deck
    DROP COLUMN IF EXISTS bonus_draw;
ALTER TABLE deck
    DROP COLUMN IF EXISTS bonus_capture;
ALTER TABLE deck
    DROP COLUMN IF EXISTS sas_rating;
ALTER TABLE deck
    DROP COLUMN IF EXISTS synergy_rating;
ALTER TABLE deck
    DROP COLUMN IF EXISTS antisynergy_rating;
ALTER TABLE deck
    DROP COLUMN IF EXISTS aerc_version;
ALTER TABLE deck
    DROP COLUMN IF EXISTS expected_amber;
ALTER TABLE deck
    DROP COLUMN IF EXISTS amber_control;
ALTER TABLE deck
    DROP COLUMN IF EXISTS creature_control;
ALTER TABLE deck
    DROP COLUMN IF EXISTS artifact_control;
ALTER TABLE deck
    DROP COLUMN IF EXISTS efficiency;
ALTER TABLE deck
    DROP COLUMN IF EXISTS recursion;
ALTER TABLE deck
    DROP COLUMN IF EXISTS effective_power;
ALTER TABLE deck
    DROP COLUMN IF EXISTS creature_protection;
ALTER TABLE deck
    DROP COLUMN IF EXISTS disruption;
ALTER TABLE deck
    DROP COLUMN IF EXISTS other;
ALTER TABLE deck
    DROP COLUMN IF EXISTS aerc_score;
ALTER TABLE deck
    DROP COLUMN IF EXISTS anomaly_count;
ALTER TABLE deck
    DROP COLUMN IF EXISTS maverick_count;
ALTER TABLE deck
    DROP COLUMN IF EXISTS specials_count;
ALTER TABLE deck
    DROP COLUMN IF EXISTS rares_count;
ALTER TABLE deck
    DROP COLUMN IF EXISTS uncommons_count;
ALTER TABLE deck
    DROP COLUMN IF EXISTS raw_amber;
ALTER TABLE deck
    DROP COLUMN IF EXISTS total_power;
ALTER TABLE deck
    DROP COLUMN IF EXISTS creature_count;
ALTER TABLE deck
    DROP COLUMN IF EXISTS action_count;
ALTER TABLE deck
    DROP COLUMN IF EXISTS artifact_count;
ALTER TABLE deck
    DROP COLUMN IF EXISTS upgrade_count;
ALTER TABLE deck
    DROP COLUMN IF EXISTS total_armor;


DROP INDEX IF EXISTS expansion_idx;
DROP INDEX IF EXISTS house_names_string_idx;


ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS card_names;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS refreshed_bonus_icons;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS bonus_draw;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS bonus_capture;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS synergy_rating;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS antisynergy_rating;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS aerc_version;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS expected_amber;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS amber_control;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS creature_control;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS artifact_control;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS efficiency;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS recursion;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS effective_power;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS creature_protection;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS disruption;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS other;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS aerc_score;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS anomaly_count;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS maverick_count;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS specials_count;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS rares_count;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS uncommons_count;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS raw_amber;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS total_power;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS creature_count;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS action_count;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS artifact_count;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS upgrade_count;
ALTER TABLE alliance_deck
    DROP COLUMN IF EXISTS total_armor;
