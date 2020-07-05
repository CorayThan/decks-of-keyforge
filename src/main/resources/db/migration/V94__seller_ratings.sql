CREATE TABLE seller_rating (
    rating INT NOT NULL,
    title VARCHAR(80) NOT NULL,
    review VARCHAR(2500) NOT NULL,
    seller_id UUID NOT NULL,
    reviewer_id UUID NOT NULL,
    deck_purchased_id BIGINT,
    id BIGINT NOT NULL,
    created TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE seller_rating
    ADD CONSTRAINT seller_rating_seller_fk FOREIGN KEY (seller_id) REFERENCES key_user;
ALTER TABLE seller_rating
    ADD CONSTRAINT seller_rating_reviewer_fk FOREIGN KEY (reviewer_id) REFERENCES key_user;

CREATE INDEX seller_rating_seller_idx ON seller_rating(seller_id);

ALTER TABLE key_user
    ADD COLUMN lifetime_support_cents INT;
UPDATE key_user
SET lifetime_support_cents = 0;
ALTER TABLE key_user
    ALTER COLUMN lifetime_support_cents SET NOT NULL;