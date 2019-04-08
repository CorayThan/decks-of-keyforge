ALTER TABLE key_user
    ADD COLUMN most_recent_deck_listing TIMESTAMP;
CREATE INDEX most_recent_listing_key_user_idx ON key_user(most_recent_deck_listing);
ALTER TABLE key_user
    ADD COLUMN seller_email VARCHAR(255);
ALTER TABLE key_user
    ADD COLUMN discord VARCHAR(255);
ALTER TABLE key_user
    ADD COLUMN store_name VARCHAR(40);

ALTER TABLE deck
    ADD COLUMN listed_on TIMESTAMP;
CREATE INDEX deck_listed_on_idx ON deck(listed_on DESC, id);
