ALTER TABLE offer
    ADD COLUMN sender_archived BOOLEAN DEFAULT FALSE;

CREATE INDEX offer_sender_archived_idx ON offer(sender_archived);

UPDATE offer
SET sender_archived = FALSE;

ALTER TABLE offer
    ALTER COLUMN sender_archived SET NOT NULL;


ALTER TABLE offer
    ADD COLUMN recipient_archived BOOLEAN DEFAULT FALSE;

CREATE INDEX offer_recipient_archived_idx ON offer(recipient_archived);

UPDATE offer
SET recipient_archived = FALSE;

ALTER TABLE offer
    ALTER COLUMN recipient_archived SET NOT NULL;
