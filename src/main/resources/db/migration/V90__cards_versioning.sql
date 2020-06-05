CREATE TABLE cards_version (
    id INT8 NOT NULL,
    version INT4 NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO cards_version (id, version)
VALUES (1, 1);
