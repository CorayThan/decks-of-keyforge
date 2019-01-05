create sequence hibernate_sequence start 1 increment 1;

create table card (
   id varchar(255) not null,
    amber int4 not null,
    armor int4 not null,
    card_number int4 not null,
    card_text varchar(2000),
    card_title varchar(255),
    card_type varchar(255),
    expansion int4 not null,
    flavor_text varchar(2000),
    front_image varchar(255),
    house varchar(255),
    maverick boolean not null,
    power int4 not null,
    rarity varchar(255),
    primary key (id)
);

create table card_traits (
   card_id varchar(255) not null,
    traits varchar(255)
);

create table deck (
   id int8 not null,
    amber_control float8 not null,
    antisynergy_rating int4 not null,
    artifact_control float8 not null,
    cards_rating int4 not null,
    chains int4 not null,
    creature_control float8 not null,
    expansion int4 not null,
    expected_amber float8 not null,
    for_sale boolean not null,
    for_trade boolean not null,
    funny_count int4 not null,
    keyforge_id varchar(255),
    losses int4 not null,
    maverick_count int4 not null,
    name varchar(255),
    power_level int4 not null,
    rares_count int4 not null,
    raw_amber int4 not null,
    sas_rating int4 not null,
    specials_count int4 not null,
    synergy_rating int4 not null,
    total_actions int4 not null,
    total_armor int4 not null,
    total_artifacts int4 not null,
    total_creatures int4 not null,
    total_power int4 not null,
    total_upgrades int4 not null,
    uncommons_count int4 not null,
    wins int4 not null,
    wishlist_count int4 not null,
    primary key (id)
);

create table deck_cards (
   deck_id int8 not null,
    card_id varchar(255) not null
);

create table deck_houses (
   deck_id int8 not null,
    houses varchar(255)
);

create table deck_page (
   id uuid not null,
    current_page int4 not null,
    primary key (id)
);

create table key_user (
   id uuid not null,
    allow_users_to_see_deck_ownership boolean not null,
    email varchar(255),
    password varchar(255),
    public_contact_info varchar(255),
    type varchar(255),
    username varchar(255),
    primary key (id)
);

create table syn_trait_value (
   id uuid not null,
    rating int4 not null,
    trait int4,
    type int4,
    primary key (id)
);

create table user_deck (
   id uuid not null,
    asking_price float8,
    condition int4,
    date_listed timestamp,
    date_refreshed timestamp,
    external_link varchar(255),
    for_sale boolean not null,
    for_trade boolean not null,
    funny boolean not null,
    listing_info varchar(255),
    owned boolean not null,
    redeemed boolean not null,
    wishlist boolean not null,
    deck_id int8,
    user_id uuid,
    primary key (id)
);

alter table if exists deck
   add constraint deck_keyforge_id_uk unique (keyforge_id);

alter table if exists key_user
   add constraint key_user_email_uk unique (email);

alter table if exists key_user
   add constraint key_user_username_uk unique (username);

alter table if exists card_traits
   add constraint card_traits_card_fk
   foreign key (card_id)
   references card;

alter table if exists deck_cards
   add constraint deck_cards_card_fk
   foreign key (card_id)
   references card;

alter table if exists deck_cards
   add constraint deck_cards_deck_fk
   foreign key (deck_id)
   references deck;

alter table if exists deck_houses
   add constraint deck_houses_fk
   foreign key (deck_id)
   references deck;

alter table if exists user_deck
   add constraint user_deck_deck_fk
   foreign key (deck_id)
   references deck;

alter table if exists user_deck
   add constraint user_deck_key_user_fk
   foreign key (user_id)
   references key_user;
