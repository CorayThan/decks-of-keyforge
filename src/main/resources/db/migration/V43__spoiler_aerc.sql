ALTER TABLE spoiler
    ADD COLUMN expected_amber FLOAT8;
ALTER TABLE spoiler
    ADD COLUMN amber_control FLOAT8;
ALTER TABLE spoiler
    ADD COLUMN artifact_control FLOAT8;
ALTER TABLE spoiler
    ADD COLUMN creature_control FLOAT8;
ALTER TABLE spoiler
    ADD COLUMN effective_power INT4;
ALTER TABLE spoiler
    ADD COLUMN efficiency FLOAT8;
ALTER TABLE spoiler
    ADD COLUMN amber_protection FLOAT8;
ALTER TABLE spoiler
    ADD COLUMN disruption FLOAT8;
ALTER TABLE spoiler
    ADD COLUMN house_cheating FLOAT8;
ALTER TABLE spoiler
    ADD COLUMN other FLOAT8;

UPDATE spoiler
SET expected_amber   = 0, amber_control = 0, artifact_control = 0,
    creature_control = 0, effective_power = 0, efficiency = 0, amber_protection = 0,
    disruption       = 0,
    house_cheating   = 0,
    other            = 0;
