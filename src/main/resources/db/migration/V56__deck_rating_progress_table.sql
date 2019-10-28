CREATE TABLE deck_rating_progress (
    id                 UUID NOT NULL,
    complete_date_time TIMESTAMP,
    current_page       INT4 NOT NULL,
    version            INT4 NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE deck
    DROP COLUMN cards_rating;
ALTER TABLE deck
    DROP COLUMN rating_version;
