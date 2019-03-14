package coraythan.keyswap.decks.games

/**

CREATE TABLE deck_games (
id      UUID NOT NULL,
deck_id INT8,
user_id UUID,
PRIMARY KEY (id)
);

CREATE TABLE deck_game_info (
id           UUID NOT NULL,

deck_games_id UUID,
PRIMARY KEY (id)
);

ALTER TABLE
IF EXISTS deck_games
ADD
CONSTRAINT deck_games_deck_fk FOREIGN KEY (deck_id) REFERENCES deck;
ALTER TABLE
IF EXISTS deck_games
ADD
CONSTRAINT deck_games_key_user_fk FOREIGN KEY (user_id) REFERENCES key_user;
ALTER TABLE
IF EXISTS deck_game_info
ADD
CONSTRAINT deck_game_info_deck_games_fk FOREIGN KEY (deck_games_id) REFERENCES deck_games;



 **/