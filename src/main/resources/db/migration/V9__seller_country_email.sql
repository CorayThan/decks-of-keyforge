
ALTER TABLE user_deck ADD COLUMN for_sale_in_country varchar(255);
ALTER TABLE key_user ADD COLUMN country varchar(255);

ALTER TABLE key_user ALTER COLUMN public_contact_info TYPE varchar(2000);
