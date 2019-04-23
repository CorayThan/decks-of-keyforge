CREATE TABLE auction (
    id                        UUID          NOT NULL,
    bought_with_buy_it_now_id UUID,
    bid_increment             INT4          NOT NULL,
    buy_it_now                INT4,
    currency_symbol           VARCHAR(5)    NOT NULL,
    deck_id                   INT8          NOT NULL,
    duration_days             INT4          NOT NULL,
    seller_id                 UUID          NOT NULL,
    status                    VARCHAR(255)  NOT NULL,
    bought_now_on             TIMESTAMP,
    end_date_time             TIMESTAMP     NOT NULL,
    starting_bid              INT4          NOT NULL,
    condition                 INT4          NOT NULL,
    date_listed               TIMESTAMP     NOT NULL,
    external_link             VARCHAR(255)  NOT NULL,
    listing_info              VARCHAR(2000) NOT NULL,
    redeemed                  BOOLEAN       NOT NULL,
    for_sale_in_country       VARCHAR(255)  NOT NULL,
    language                  VARCHAR(255)  NOT NULL,
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

ALTER TABLE IF EXISTS public.deck
    ADD COLUMN completed_auction BOOLEAN;

-- noinspection SqlWithoutWhere
UPDATE deck
SET for_auction = 'false', completed_auction = 'false';

ALTER TABLE IF EXISTS public.deck
    ALTER COLUMN for_auction SET NOT NULL;

ALTER TABLE IF EXISTS public.deck
    ALTER COLUMN completed_auction SET NOT NULL;

ALTER TABLE IF EXISTS public.user_deck
    ADD COLUMN language VARCHAR(255);

ALTER TABLE IF EXISTS auction_bid
    ADD CONSTRAINT auction_bid_auction_fk FOREIGN KEY (auction_id) REFERENCES auction;

ALTER TABLE IF EXISTS auction_bid
    ADD CONSTRAINT auction_bid_key_user_fk FOREIGN KEY (bidder_id) REFERENCES key_user;

CREATE INDEX for_auction_idx ON deck(for_auction);
CREATE INDEX completed_auction_idx ON deck(completed_auction);

ALTER TABLE IF EXISTS auction
    ADD CONSTRAINT auction_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;

ALTER TABLE IF EXISTS auction
    ADD CONSTRAINT auction_buy_it_now_key_user_fk FOREIGN KEY (bought_with_buy_it_now_id) REFERENCES key_user;

ALTER TABLE IF EXISTS auction
    ADD CONSTRAINT seller_auction_fk FOREIGN KEY (seller_id) REFERENCES key_user;

-- All the currency symbol stuff

ALTER TABLE IF EXISTS key_user
    ADD COLUMN currency_symbol VARCHAR(5);

-- noinspection SqlWithoutWhere
UPDATE key_user
SET currency_symbol = '$';

ALTER TABLE IF EXISTS public.key_user
    ALTER COLUMN currency_symbol SET NOT NULL;

ALTER TABLE IF EXISTS user_deck
    ADD COLUMN currency_symbol VARCHAR(5);

-- rollback:

-- DROP TABLE IF EXISTS auction CASCADE;
-- DROP TABLE IF EXISTS auction_bid;
-- ALTER TABLE deck
--     DROP COLUMN IF EXISTS for_auction;
-- ALTER TABLE deck
--     DROP COLUMN IF EXISTS completed_auction;
-- ALTER TABLE user_deck
--     DROP COLUMN IF EXISTS language;
-- ALTER TABLE user_deck
--     DROP COLUMN IF EXISTS currency_symbol;
-- ALTER TABLE key_user
--     DROP COLUMN IF EXISTS currency_symbol;
-- DELETE
-- FROM flyway_schema_history
-- WHERE version = '21';
