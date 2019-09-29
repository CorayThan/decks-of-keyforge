CREATE TABLE spoiler (
    id INT8 NOT NULL,
    amber INT4 NOT NULL,
    armor_string VARCHAR(255) NOT NULL,
    card_number VARCHAR(255) NOT NULL,
    card_text VARCHAR(2000) NOT NULL,
    card_title VARCHAR(255) NOT NULL,
    card_type VARCHAR(255) NOT NULL,
    expansion INT4 NOT NULL,
    front_image VARCHAR(255),
    house VARCHAR(255) NOT NULL,
    power_string VARCHAR(255) NOT NULL,
    rarity VARCHAR(255) NOT NULL,
    ACTIVE BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);
