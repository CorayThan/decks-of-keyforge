ALTER TABLE purchase
    DROP COLUMN auction_id;

ALTER TABLE purchase
    ADD COLUMN sale_type VARCHAR(255);
ALTER TABLE purchase
    ADD COLUMN seller_country VARCHAR(255);
ALTER TABLE purchase
    ADD COLUMN buyer_country VARCHAR(255);
