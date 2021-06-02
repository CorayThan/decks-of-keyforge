ALTER TABLE deck_listing
    ADD COLUMN tag_id INT8;

ALTER TABLE deck_listing
    ADD CONSTRAINT deck_listing_tag_fk FOREIGN KEY (tag_id) REFERENCES ktag;