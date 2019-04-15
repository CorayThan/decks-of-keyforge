CREATE TABLE auction (
    id            UUID    NOT NULL,
    bid_increment INT4    NOT NULL,
    buy_it_now    INT4,
    complete      BOOLEAN NOT NULL,
    duration_days INT4    NOT NULL,
    end_date_time TIMESTAMP,
    starting_bid  INT4    NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE auction_bid (
    id         UUID NOT NULL,
    bid        INT4 NOT NULL,
    bid_time   TIMESTAMP,
    auction_id UUID,
    bidder_id  UUID,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.deck
    ADD COLUMN for_auction BOOLEAN;

-- noinspection SqlWithoutWhere
UPDATE deck
SET for_auction = 'false';

ALTER TABLE IF EXISTS public.user_deck
    ADD COLUMN currency_symbol VARCHAR(255);

ALTER TABLE IF EXISTS public.user_deck
    ADD COLUMN for_auction BOOLEAN;

-- noinspection SqlWithoutWhere
UPDATE user_deck
SET for_auction = 'false';

ALTER TABLE IF EXISTS public.user_deck
    ADD COLUMN language VARCHAR(255);

ALTER TABLE IF EXISTS auction_bid
    ADD CONSTRAINT auction_bid_auction_fk FOREIGN KEY (auction_id) REFERENCES auction;

ALTER TABLE IF EXISTS auction_bid
    ADD CONSTRAINT auction_bid_key_user_fk FOREIGN KEY (bidder_id) REFERENCES key_user;

-- rollback:

-- DROP TABLE IF EXISTS auction CASCADE;
-- DROP TABLE IF EXISTS auction_bid;
-- ALTER TABLE deck
--     DROP COLUMN for_auction;
-- ALTER TABLE user_deck
--     DROP COLUMN currency_symbol;
-- ALTER TABLE user_deck
--     DROP COLUMN for_auction;
-- ALTER TABLE user_deck
--     DROP COLUMN language;