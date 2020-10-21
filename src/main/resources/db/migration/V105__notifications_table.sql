CREATE TABLE sale_notification_constraint (
    id INT8 NOT NULL,
    cap INT4,
    property VARCHAR(255),
    value INT4 NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE sale_notification_deck_card_quantity (
    id INT8 NOT NULL,
    house INT4,
    mav BOOLEAN,
    quantity INT4 NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE sale_notification_deck_card_quantity_card_names (
    sale_notification_deck_card_quantity_id INT8 NOT NULL,
    card_names VARCHAR(255)
);
CREATE TABLE sale_notification_query (
    id INT8 NOT NULL,
    for_auction BOOLEAN NOT NULL,
    for_sale BOOLEAN NOT NULL,
    for_sale_in_country INT4,
    for_trade BOOLEAN NOT NULL,
    name VARCHAR(255),
    owner VARCHAR(255),
    title VARCHAR(255),
    user_id UUID,
    PRIMARY KEY (id)
);
CREATE TABLE sale_notification_query_cards (
    sale_notification_query_id INT8 NOT NULL,
    cards_id INT8 NOT NULL
);
CREATE TABLE sale_notification_query_constraints (
    sale_notification_query_id INT8 NOT NULL,
    constraints_id INT8 NOT NULL
);
CREATE TABLE sale_notification_query_exclude_houses (
    sale_notification_query_id INT8 NOT NULL,
    exclude_houses VARCHAR(255)
);
CREATE TABLE sale_notification_query_expansions (
    sale_notification_query_id INT8 NOT NULL,
    expansions INT4
);
CREATE TABLE sale_notification_query_houses (
    sale_notification_query_id INT8 NOT NULL,
    houses VARCHAR(255)
);

ALTER TABLE sale_notification_query_cards
    ADD CONSTRAINT sale_notifs_query_cards_uk UNIQUE (cards_id);

ALTER TABLE sale_notification_query_constraints
    ADD CONSTRAINT sale_notif_query_constraints_uk UNIQUE (constraints_id);

ALTER TABLE sale_notification_deck_card_quantity_card_names
    ADD CONSTRAINT sale_notif_deck_card_card_names_fk FOREIGN KEY (sale_notification_deck_card_quantity_id) REFERENCES sale_notification_deck_card_quantity;
ALTER TABLE sale_notification_query
    ADD CONSTRAINT sale_notif_user_fk FOREIGN KEY (user_id) REFERENCES key_user;
ALTER TABLE sale_notification_query_cards
    ADD CONSTRAINT sale_notif_deck_card_quantity_fk FOREIGN KEY (cards_id) REFERENCES sale_notification_deck_card_quantity;
ALTER TABLE sale_notification_query_cards
    ADD CONSTRAINT sale_notif_query_cards_fk FOREIGN KEY (sale_notification_query_id) REFERENCES sale_notification_query;
ALTER TABLE sale_notification_query_constraints
    ADD CONSTRAINT sale_notif_constraints_fk FOREIGN KEY (constraints_id) REFERENCES sale_notification_constraint;
ALTER TABLE sale_notification_query_constraints
    ADD CONSTRAINT sale_notif_constraints_query_fk FOREIGN KEY (sale_notification_query_id) REFERENCES sale_notification_query;
ALTER TABLE sale_notification_query_exclude_houses
    ADD CONSTRAINT sale_notif_exclude_houses_fk FOREIGN KEY (sale_notification_query_id) REFERENCES sale_notification_query;
ALTER TABLE sale_notification_query_expansions
    ADD CONSTRAINT sale_notif_expansions_fk FOREIGN KEY (sale_notification_query_id) REFERENCES sale_notification_query;
ALTER TABLE sale_notification_query_houses
    ADD CONSTRAINT sale_notif_houses_fk FOREIGN KEY (sale_notification_query_id) REFERENCES sale_notification_query;
