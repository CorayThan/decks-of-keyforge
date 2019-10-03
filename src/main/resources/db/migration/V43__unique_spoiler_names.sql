ALTER TABLE
    IF EXISTS spoiler
    ADD
        CONSTRAINT spoiler_name_uk UNIQUE (card_title);

ALTER TABLE
    IF EXISTS spoiler
    ADD
        CONSTRAINT card_number_uk UNIQUE (card_number);