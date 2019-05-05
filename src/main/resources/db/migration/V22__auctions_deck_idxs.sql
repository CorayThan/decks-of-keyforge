ALTER TABLE deck
    ADD COLUMN auction_end TIMESTAMP;
CREATE INDEX deck_auction_end_idx ON deck(auction_end DESC, id);

ALTER TABLE deck
    ADD COLUMN auction_ended_on TIMESTAMP;
CREATE INDEX deck_auction_ended_on_idx ON deck(auction_ended_on DESC, id);
