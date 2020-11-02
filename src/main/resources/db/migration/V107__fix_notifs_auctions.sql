ALTER TABLE sale_notification_query
    ALTER COLUMN for_sale DROP NOT NULL;

UPDATE sale_notification_query
SET for_sale = NULL
WHERE for_auction = TRUE AND for_sale = FALSE;
