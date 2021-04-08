ALTER TABLE owned_deck
    DROP CONSTRAINT owned_deck_deck_id_owner_id_key;

ALTER TABLE owned_deck
    ADD UNIQUE (owner_id, deck_id);

ALTER TABLE favorited_deck
    DROP CONSTRAINT favorited_deck_deck_id_user_id_key;

ALTER TABLE favorited_deck
    ADD UNIQUE (user_id, deck_id);

ALTER TABLE funny_deck
    DROP CONSTRAINT funny_deck_deck_id_user_id_key;

ALTER TABLE funny_deck
    ADD UNIQUE (user_id, deck_id);
