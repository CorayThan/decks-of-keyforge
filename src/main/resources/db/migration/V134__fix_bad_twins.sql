INSERT INTO post_process_deck (deck_id) (SELECT id FROM deck d WHERE d.twin_id IS NOT NULL AND d.expansion = 496);
