
ALTER TABLE user_deck ADD UNIQUE (deck_id, user_id);

create table key_user_preferred_countries (key_user_id uuid not null, preferred_countries varchar(255));
alter table if exists key_user_preferred_countries add constraint preferred_countries_key_user_id_fk foreign key (key_user_id) references key_user;
