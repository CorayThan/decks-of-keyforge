
ALTER TABLE user_deck ADD COLUMN creator boolean;
UPDATE user_deck SET creator = false;
ALTER TABLE user_deck ALTER COLUMN creator SET NOT NULL;
