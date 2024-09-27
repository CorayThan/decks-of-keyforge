ALTER TABLE sale_notification_query
    ADD COLUMN tokens VARCHAR[] NULL;

ALTER TABLE sale_notification_query
    DROP COLUMN IF EXISTS for_auction;
