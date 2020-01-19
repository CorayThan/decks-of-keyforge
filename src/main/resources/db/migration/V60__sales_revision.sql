ALTER TABLE auction
    ADD COLUMN shipping_cost VARCHAR(255);

ALTER TABLE auction
    ALTER COLUMN starting_bid DROP NOT NULL;

ALTER TABLE auction
    ALTER COLUMN bid_increment DROP NOT NULL;

ALTER TABLE auction
    ADD COLUMN for_trade BOOLEAN;

UPDATE auction
SET for_trade = FALSE;

ALTER TABLE key_user
    ADD COLUMN shipping_cost VARCHAR(255);

ALTER TABLE key_user
    ADD COLUMN allows_trades BOOLEAN;

UPDATE key_user
SET allows_trades = FALSE;

ALTER TABLE key_user
    ALTER COLUMN allows_trades SET NOT NULL;

CREATE TABLE offer (
    amount        INT4          NOT NULL,
    auction_id    UUID          NOT NULL,
    recipient_id  UUID          NOT NULL,
    sender_id     UUID          NOT NULL,
    message       VARCHAR(2000) NOT NULL,
    offer_from    VARCHAR(255)  NOT NULL,
    status        VARCHAR(255)  NOT NULL,
    sent_time     TIMESTAMP     NOT NULL,
    viewed_time   TIMESTAMP,
    resolved_time TIMESTAMP,
    id            UUID          NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS offer
    ADD CONSTRAINT offer_auction_fk FOREIGN KEY (auction_id) REFERENCES auction;

ALTER TABLE offer
    ADD CONSTRAINT recipient_offer_fk FOREIGN KEY (recipient_id) REFERENCES key_user;

ALTER TABLE offer
    ADD CONSTRAINT sender_offer_fk FOREIGN KEY (sender_id) REFERENCES key_user;

CREATE INDEX offer_recipient_idx ON offer(recipient_id);
CREATE INDEX offer_sender_idx ON offer(sender_id);
CREATE INDEX offer_auction_idx ON offer(auction_id);

CREATE TABLE purchase (
    id                   UUID       NOT NULL,
    deck_id              INT8       NOT NULL,
    seller_id            UUID       NOT NULL,
    buyer_id             UUID       NOT NULL,
    auction_id           UUID       NOT NULL,
    sale_amount          INT4       NOT NULL,
    currency_symbol      VARCHAR(5) NOT NULL,
    purchased_on         TIMESTAMP  NOT NULL,
    shipped_on           TIMESTAMP,
    received_on          TIMESTAMP,
    tracking_number      VARCHAR(255),
    tracking_service_url VARCHAR(255),
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS purchase
    ADD CONSTRAINT purchase_auction_fk FOREIGN KEY (auction_id) REFERENCES auction;

ALTER TABLE IF EXISTS purchase
    ADD CONSTRAINT purchase_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;

ALTER TABLE IF EXISTS purchase
    ADD CONSTRAINT purchase_seller_fk FOREIGN KEY (seller_id) REFERENCES key_user;

ALTER TABLE IF EXISTS purchase
    ADD CONSTRAINT purchase_buyer_fk FOREIGN KEY (buyer_id) REFERENCES key_user;

CREATE INDEX purchase_seller_idx ON purchase(seller_id);
CREATE INDEX purchase_buyer_idx ON purchase(buyer_id);
CREATE INDEX purchase_deck_idx ON purchase(deck_id);
