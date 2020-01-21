ALTER TABLE deck_listing
    DROP COLUMN IF EXISTS shipping_cost;

ALTER TABLE deck_listing
    DROP COLUMN IF EXISTS for_trade;

ALTER TABLE key_user
    DROP COLUMN IF EXISTS shipping_cost;

ALTER TABLE key_user
    DROP COLUMN IF EXISTS allows_trades;

DROP TABLE IF EXISTS offer;
DROP TABLE IF EXISTS purchase;

DELETE
FROM flyway_schema_history
WHERE script = 'V60__sales_revision.sql';

ALTER TABLE deck_listing
    RENAME TO auction;
