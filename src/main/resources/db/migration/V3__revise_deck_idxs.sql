
CREATE INDEX deck_sas_desc_id_idx ON deck (sas_rating desc, id);
CREATE INDEX deck_sas_asc_id_idx ON deck (sas_rating, id);
CREATE INDEX deck_cards_rating_desc_id_idx ON deck (cards_rating desc, id);
CREATE INDEX deck_cards_rating_asc_id_idx ON deck (cards_rating asc, id);
CREATE INDEX deck_funny_desc_id_idx ON deck (funny_count desc, id);
CREATE INDEX deck_wishlist_desc_id_idx ON deck (wishlist_count desc, id);

drop index cards_rating_idx;
drop index sas_rating_idx;
