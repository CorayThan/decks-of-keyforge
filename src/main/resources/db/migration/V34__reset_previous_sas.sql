ALTER TABLE deck
    DROP COLUMN previous_sas_rating;

ALTER TABLE deck
    ADD COLUMN previous_sas_rating INT4;
