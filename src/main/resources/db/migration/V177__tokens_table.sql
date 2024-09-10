CREATE TABLE IF NOT EXISTS token
(
    id         INT4    NOT NULL,
    card_title VARCHAR NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE token
    ADD CONSTRAINT token_card_title_uk UNIQUE (card_title);

INSERT INTO token
VALUES (0, 'Berserker');
INSERT INTO token
VALUES (1, 'Warrior');
INSERT INTO token
VALUES (2, 'Skirmisher');
INSERT INTO token
VALUES (3, 'Grumpus');
INSERT INTO token
VALUES (4, 'Strange Shell');
INSERT INTO token
VALUES (5, 'Diplomat');
INSERT INTO token
VALUES (6, 'Trader');
INSERT INTO token
VALUES (7, 'Prospector');
INSERT INTO token
VALUES (8, 'Blorb');
INSERT INTO token
VALUES (9, 'Grunt');
INSERT INTO token
VALUES (10, 'Rebel');
INSERT INTO token
VALUES (11, 'Researcher');
INSERT INTO token
VALUES (12, 'Disciple');
INSERT INTO token
VALUES (13, 'Cleric');
INSERT INTO token
VALUES (14, 'Defender');
INSERT INTO token
VALUES (15, 'Squire');
INSERT INTO token
VALUES (16, 'Bellatoran Warrior');
INSERT INTO token
VALUES (17, 'Scholar');
INSERT INTO token
VALUES (18, 'Senator');
INSERT INTO token
VALUES (19, 'Trooper');
INSERT INTO token
VALUES (20, 'Æmberling');
INSERT INTO token
VALUES (21, 'Cadet');
INSERT INTO token
VALUES (22, 'Explorer');
INSERT INTO token
VALUES (23, 'B0-T');
INSERT INTO token
VALUES (24, 'Cultist');
INSERT INTO token
VALUES (25, 'Fish');
INSERT INTO token
VALUES (26, 'Priest');
INSERT INTO token
VALUES (27, 'Raider');
INSERT INTO token
VALUES (28, 'Æmber Munch');
INSERT INTO token
VALUES (29, 'Minutemartian');
INSERT INTO token
VALUES (30, 'Steppe Wolf');
INSERT INTO token
VALUES (31, 'Sentinel');
INSERT INTO token
VALUES (32, 'Niffle Brute');
INSERT INTO token
VALUES (33, 'Thrall');
INSERT INTO token
VALUES (34, 'Snare');
INSERT INTO token
VALUES (35, 'Æmberologist');
INSERT INTO token
VALUES (36, 'Cleaner');
INSERT INTO token
VALUES (37, 'Corsair');
INSERT INTO token
VALUES (38, 'Zealot');
INSERT INTO token
VALUES (39, 'Catena Fiend');

CREATE SEQUENCE IF NOT EXISTS token_sequence START 40 INCREMENT 1;
