ALTER TABLE deck_statistics_entity
    DROP CONSTRAINT deck_statistics_entity_version_uq;
ALTER TABLE deck_statistics_entity
    ADD CONSTRAINT deck_statistics_entity_version_expansion_uq UNIQUE (version, expansion);
