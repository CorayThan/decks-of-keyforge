ALTER TABLE purchase
    ALTER COLUMN seller_id DROP NOT NULL;

ALTER TABLE purchase
    ALTER COLUMN buyer_id DROP NOT NULL;

ALTER TABLE purchase
    ALTER COLUMN currency_symbol DROP NOT NULL;

ALTER TABLE purchase
    ALTER COLUMN sale_type SET NOT NULL;

