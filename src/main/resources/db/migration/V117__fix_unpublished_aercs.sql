UPDATE extra_card_info
SET published = '2019-08-01'
WHERE published IS NULL;

UPDATE extra_card_info
SET published = NULL
WHERE version = 32;
