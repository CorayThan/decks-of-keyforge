ALTER TABLE sale_notification_query
    ADD COLUMN precedence INT4;

UPDATE sale_notification_query
SET precedence = 100;

ALTER TABLE sale_notification_query
    ALTER COLUMN precedence SET NOT NULL;

