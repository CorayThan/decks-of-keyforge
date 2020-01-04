ALTER TABLE auction
    DROP COLUMN IF EXISTS shipping_cost;

ALTER TABLE key_user
    DROP COLUMN IF EXISTS shipping_cost;

ALTER TABLE key_user
    DROP COLUMN IF EXISTS allows_trades;

DROP TABLE IF EXISTS offer;
DROP TABLE IF EXISTS purchase;

DELETE
FROM flyway_schema_history
WHERE script = 'V60__sales_revision.sql';
