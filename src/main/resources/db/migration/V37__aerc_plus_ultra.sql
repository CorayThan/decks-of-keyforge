ALTER TABLE deck
    RENAME COLUMN deck_manipulation TO efficiency;
ALTER TABLE deck
    ADD COLUMN steal_prevention FLOAT8;
ALTER TABLE deck
    ADD COLUMN disruption FLOAT8;
ALTER TABLE deck
    ADD COLUMN house_cheating FLOAT8;
ALTER TABLE deck
    ADD COLUMN other FLOAT8;

CREATE INDEX deck_steal_prevention_idx ON deck(steal_prevention);
CREATE INDEX deck_disruption_idx ON deck(disruption);
CREATE INDEX deck_raw_amber_idx ON deck(raw_amber);
CREATE INDEX deck_house_cheating_idx ON deck(house_cheating);

ALTER INDEX deck_manipulation_idx RENAME TO deck_efficiency_idx;
