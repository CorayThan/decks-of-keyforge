TRUNCATE auction_bid, deck_note, favorited_deck, funny_deck, offer, previously_owned_deck, private_message, purchase,
    sale_notification_query_constraints, sale_notification_constraint, sale_notification_deck_card_quantity,
    sale_notification_deck_card_quantity_card_names, sale_notification_query_cards,
    sale_notification_query_exclude_houses, sale_notification_query_expansions, sale_notification_query_houses,
    sale_notification_query, team_invites, past_sas;

DELETE
FROM owned_deck od USING key_user ku
WHERE ku.id = od.owner_id
  AND ku.allow_users_to_see_deck_ownership = FALSE;
DELETE
FROM owned_alliance_deck od USING key_user ku 
WHERE ku.id = od.owner_id
  AND ku.allow_users_to_see_deck_ownership = FALSE;
UPDATE key_user ku
SET email    = (ku.username || '@dok.fake'),
    password = '$2a$10$N3UlNyYNgndwUQgYos1hq.jwIL.K4utk14pYtZki2Otc3Ii7WdvuW';
UPDATE deck_listing
SET tag_id = NULL
WHERE tag_id IS NOT NULL;
DELETE
FROM deck_tag dt USING ktag k
WHERE dt.tag_id = k.id
  AND k.publicity_type != 'PUBLIC';
DELETE
FROM ktag
WHERE publicity_type != 'PUBLIC';

--DELETE OWNED DECKS EXCEPT MOST RECENT 50,000
DELETE
FROM owned_deck
WHERE NOT owned_deck.deck_id IN (SELECT deck.id
                                 FROM deck
                                          INNER JOIN owned_deck ON deck.id = owned_deck.deck_id
                                          INNER JOIN key_user ON owned_deck.owner_id = key_user.id
                                 WHERE deck.import_date_time IS NOT NULL
                                   AND key_user.allow_users_to_see_deck_ownership = TRUE
                                 ORDER BY deck.import_date_time DESC
                                 LIMIT 50000);

--BEGIN SLIM DECKS
-- DROP TABLE IF EXISTS
--     deck_ids_to_delete;
-- CREATE TEMPORARY TABLE deck_ids_to_delete
-- (
--     id BIGINT
-- );
--
-- INSERT INTO deck_ids_to_delete (id)
-- SELECT deck.id
-- FROM deck
--          LEFT JOIN owned_deck ON deck.id = owned_deck.deck_id
-- WHERE owned_deck.id IS NULL;
--
--
-- DELETE
-- FROM deck_tag
--     USING deck_ids_to_delete
-- WHERE deck_tag.deck_id = deck_ids_to_delete.id;
--
-- DELETE
-- FROM deck_listing
--     USING deck_ids_to_delete
-- WHERE deck_listing.deck_id = deck_ids_to_delete.id;
--
-- DELETE
-- FROM deck_ownership
--     USING deck_ids_to_delete
-- WHERE deck_ownership.deck_id = deck_ids_to_delete.id;
--
-- DELETE
-- FROM deck_ids_to_delete
--     USING alliance_house
-- WHERE deck_ids_to_delete.id = alliance_house.deck_id;
--
-- DELETE
-- FROM deck_ids_to_delete
--     USING tournament_deck
-- WHERE deck_ids_to_delete.id = tournament_deck.deck_id;
--
-- DELETE
-- FROM deck
--     USING deck_ids_to_delete
-- WHERE deck.id = deck_ids_to_delete.id;
--END SLIM DECKS
