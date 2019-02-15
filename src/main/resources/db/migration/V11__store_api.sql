
ALTER TABLE key_user ADD COLUMN api_key character varying(50);
CREATE INDEX key_user_api_key_idx ON key_user (api_key);
