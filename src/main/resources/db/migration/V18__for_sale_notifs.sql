CREATE TABLE for_sale_query_entity (
  id      UUID NOT NULL,
  json    VARCHAR(100000),
  name    VARCHAR(255),
  user_id UUID,
  active  BOOLEAN,
  PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS for_sale_query_entity
  ADD CONSTRAINT for_sale_query_entity_key_user_fk FOREIGN KEY (user_id) REFERENCES key_user;
