
ALTER TABLE deck ADD COLUMN card_ids text;
UPDATE deck SET card_ids = '';
ALTER TABLE deck ALTER COLUMN card_ids SET NOT NULL;
