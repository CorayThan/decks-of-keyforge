
ALTER TABLE deck ADD COLUMN registered boolean;
UPDATE deck SET registered = TRUE;
ALTER TABLE deck ALTER COLUMN rating_version SET NOT NULL;

create index deck_chains_desc_idx on deck (chains desc, id);
create index deck_registered_idx on deck (registered);
