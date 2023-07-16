CREATE TABLE published_sas_version
(
    id            UUID      NOT NULL,
    version       INT4      NOT NULL,
    major_version BOOL      NOT NULL,
    published     TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO published_sas_version (id, version, major_version, published)
VALUES ('c1989298-3cbe-4ac5-a77f-e51e77561d59', 43, FALSE, CURRENT_TIMESTAMP);
