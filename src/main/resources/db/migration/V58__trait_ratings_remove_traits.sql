DELETE
FROM syn_trait_value
WHERE trait = 'badPenny';
DELETE
FROM syn_trait_value
WHERE trait = 'routineJob';
DELETE
FROM syn_trait_value
WHERE trait = 'urchin';
DELETE
FROM syn_trait_value
WHERE trait = 'ancientBear';
DELETE
FROM syn_trait_value
WHERE trait = 'warGrumpus';
DELETE
FROM syn_trait_value
WHERE trait = 'ortannusBinding';

UPDATE syn_trait_value
SET rating = 4
WHERE rating = 3;
UPDATE syn_trait_value
SET rating = 3
WHERE rating = 2;
UPDATE syn_trait_value
SET rating = 2
WHERE rating = 1;
