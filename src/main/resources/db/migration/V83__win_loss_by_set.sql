CREATE TABLE card_wins (
    card_name VARCHAR(255) NOT NULL,
    expansion VARCHAR(255) NOT NULL,
    wins INT4 NOT NULL,
    losses INT4 NOT NULL,
    id UUID NOT NULL,
    PRIMARY KEY (id)
);
