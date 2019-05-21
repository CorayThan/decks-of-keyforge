ALTER TABLE card
    ALTER COLUMN card_number TYPE VARCHAR(255);

ALTER TABLE card
    ADD COLUMN power_string CHARACTER VARYING(50);

ALTER TABLE card
    ADD COLUMN armor_string CHARACTER VARYING(50);

UPDATE card card1
SET power_string = card2.power
FROM card card2
WHERE card1.id = card2.id;

UPDATE card card1
SET armor_string = card2.armor
FROM card card2
WHERE card1.id = card2.id;

CREATE INDEX card_number_idx ON card(card_number);
CREATE INDEX expansion_idx ON deck(expansion);
