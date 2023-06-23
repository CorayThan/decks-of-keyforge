ALTER TABLE deck
    ADD COLUMN token_number INT4;

--Berserker
update deck set token_number = 0 where token_id = 'a7ccd0d9-1e58-4420-a367-6970cb51283f';
--Warrior
update deck set token_number = 1 where token_id = '20de9c5f-f10a-47d0-8179-b8f56b90331d';
--Skirmisher
update deck set token_number = 2 where token_id = '761ed58c-4c43-470a-a083-fbb5d1e8176f';
--Grumpus
update deck set token_number = 3 where token_id = '61bbdd78-4780-4c9c-95e1-5c470b24c9cf';
--Strange Shell
update deck set token_number = 4 where token_id = '3b8f65e0-786e-4bab-9eca-1835e882633d';
--Diplomat
update deck set token_number = 5 where token_id = '403940b0-70fd-46c3-a93e-b3558b6e2db9';
--Trader
update deck set token_number = 6 where token_id = '4b946ee4-15e3-49aa-8537-bd9627ed91ba';
--Prospector
update deck set token_number = 7 where token_id = '20cbe974-6b91-4e4c-95b0-9068e6e06cb5';
--Blorb
update deck set token_number = 8 where token_id = '6d00ff20-4630-4a2b-9f1b-b1e918fa62ae';
--Grunt
update deck set token_number = 9 where token_id = '94209e50-cca6-4953-be2e-df27b544eb31';
--Rebel
update deck set token_number = 10 where token_id = '69191791-1c86-44c4-ac55-b24d43667609';
--Researcher
update deck set token_number = 11 where token_id = 'cf7d5799-30bf-413c-a70b-8d1a1ddad093';
--Disciple
update deck set token_number = 12 where token_id = '23fd4e9c-9a64-4030-9be1-cbbb4d5405bf';
--Cleric
update deck set token_number = 13 where token_id = 'ba4d0590-8497-45dc-b3a1-900d988e38eb';
--Defender
update deck set token_number = 14 where token_id = 'dda6109f-1b26-4919-961a-55cf056f163e';
--Squire
update deck set token_number = 15 where token_id = '9f61eb7a-fed4-4c6b-a6ed-fcf2c24df519';
--Bellatoran Warrior
update deck set token_number = 16 where token_id = 'df3fa208-80a7-4105-9415-5fae9eff85ed';
--Scholar
update deck set token_number = 17 where token_id = 'fb45d5f6-0e45-4581-91c9-379b7aa9391f';
-- Senator
update deck set token_number = 18 where token_id = '173f5475-ad49-4b96-a9f1-789068e2e6c7';
--Trooper
update deck set token_number = 19 where token_id = '222c6d56-fcfa-405a-9802-4788ad7a00d1';
--Æmberling
update deck set token_number = 20 where token_id = 'bf382d6a-c3de-4251-b8b4-3801444a846b';
--Cadet
update deck set token_number = 21 where token_id = 'dd740548-3380-4e50-b218-8b476bb2dd07';
-- Explorer
update deck set token_number = 22 where token_id = '15d9745d-40c2-43f8-bf3e-668f180198c3';
--B0-T
update deck set token_number = 23 where token_id = 'ec000edb-d1b3-4678-81aa-c5bc68499677';
--Cultist
update deck set token_number = 24 where token_id = 'ccc13633-11ef-460e-844b-f946f5345f3a';
--Fish
update deck set token_number = 25 where token_id = 'a0831193-09b3-42af-8647-41e4bf779d5b';
--Priest
update deck set token_number = 26 where token_id = 'e86726e7-b3bf-4178-bbbf-fb84b89c48e3';
--Raider
update deck set token_number = 27 where token_id = '30215c87-663c-404c-89c7-7952f521520d';

CREATE INDEX deck_token_number_idx ON deck (token_number);

ALTER TABLE deck
    DROP COLUMN token_id;


ALTER TABLE alliance_deck
    ADD COLUMN token_number INT4;

--Berserker
update alliance_deck set token_number = 0 where token_id = 'a7ccd0d9-1e58-4420-a367-6970cb51283f';
--Warrior
update alliance_deck set token_number = 1 where token_id = '20de9c5f-f10a-47d0-8179-b8f56b90331d';
--Skirmisher
update alliance_deck set token_number = 2 where token_id = '761ed58c-4c43-470a-a083-fbb5d1e8176f';
--Grumpus
update alliance_deck set token_number = 3 where token_id = '61bbdd78-4780-4c9c-95e1-5c470b24c9cf';
--Strange Shell
update alliance_deck set token_number = 4 where token_id = '3b8f65e0-786e-4bab-9eca-1835e882633d';
--Diplomat
update alliance_deck set token_number = 5 where token_id = '403940b0-70fd-46c3-a93e-b3558b6e2db9';
--Trader
update alliance_deck set token_number = 6 where token_id = '4b946ee4-15e3-49aa-8537-bd9627ed91ba';
--Prospector
update alliance_deck set token_number = 7 where token_id = '20cbe974-6b91-4e4c-95b0-9068e6e06cb5';
--Blorb
update alliance_deck set token_number = 8 where token_id = '6d00ff20-4630-4a2b-9f1b-b1e918fa62ae';
--Grunt
update alliance_deck set token_number = 9 where token_id = '94209e50-cca6-4953-be2e-df27b544eb31';
--Rebel
update alliance_deck set token_number = 10 where token_id = '69191791-1c86-44c4-ac55-b24d43667609';
--Researcher
update alliance_deck set token_number = 11 where token_id = 'cf7d5799-30bf-413c-a70b-8d1a1ddad093';
--Disciple
update alliance_deck set token_number = 12 where token_id = '23fd4e9c-9a64-4030-9be1-cbbb4d5405bf';
--Cleric
update alliance_deck set token_number = 13 where token_id = 'ba4d0590-8497-45dc-b3a1-900d988e38eb';
--Defender
update alliance_deck set token_number = 14 where token_id = 'dda6109f-1b26-4919-961a-55cf056f163e';
--Squire
update alliance_deck set token_number = 15 where token_id = '9f61eb7a-fed4-4c6b-a6ed-fcf2c24df519';
--Bellatoran Warrior
update alliance_deck set token_number = 16 where token_id = 'df3fa208-80a7-4105-9415-5fae9eff85ed';
--Scholar
update alliance_deck set token_number = 17 where token_id = 'fb45d5f6-0e45-4581-91c9-379b7aa9391f';
-- Senator
update alliance_deck set token_number = 18 where token_id = '173f5475-ad49-4b96-a9f1-789068e2e6c7';
--Trooper
update alliance_deck set token_number = 19 where token_id = '222c6d56-fcfa-405a-9802-4788ad7a00d1';
--Æmberling
update alliance_deck set token_number = 20 where token_id = 'bf382d6a-c3de-4251-b8b4-3801444a846b';
--Cadet
update alliance_deck set token_number = 21 where token_id = 'dd740548-3380-4e50-b218-8b476bb2dd07';
-- Explorer
update alliance_deck set token_number = 22 where token_id = '15d9745d-40c2-43f8-bf3e-668f180198c3';
--B0-T
update alliance_deck set token_number = 23 where token_id = 'ec000edb-d1b3-4678-81aa-c5bc68499677';
--Cultist
update alliance_deck set token_number = 24 where token_id = 'ccc13633-11ef-460e-844b-f946f5345f3a';
--Fish
update alliance_deck set token_number = 25 where token_id = 'a0831193-09b3-42af-8647-41e4bf779d5b';
--Priest
update alliance_deck set token_number = 26 where token_id = 'e86726e7-b3bf-4178-bbbf-fb84b89c48e3';
--Raider
update alliance_deck set token_number = 27 where token_id = '30215c87-663c-404c-89c7-7952f521520d';

CREATE INDEX alliance_deck_token_number_idx ON alliance_deck (token_number);

ALTER TABLE alliance_deck
    DROP COLUMN token_id;
