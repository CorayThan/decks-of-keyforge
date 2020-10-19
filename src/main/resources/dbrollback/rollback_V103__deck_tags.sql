drop table if exists decktag CASCADE;
drop table if exists ktag CASCADE;
drop table if exists previously_owned_deck CASCADE;

delete from flyway_schema_history where version = '103';

