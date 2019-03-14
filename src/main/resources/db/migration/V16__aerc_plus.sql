ALTER TABLE deck
  ADD COLUMN deck_manipulation FLOAT8;
ALTER TABLE deck
  ADD COLUMN effective_power INT4;

CREATE INDEX deck_manipulation_idx ON deck(deck_manipulation);
CREATE INDEX deck_effective_power_idx ON deck(effective_power);

ALTER TABLE deck
  RENAME total_creatures TO creature_count;
ALTER TABLE deck
  RENAME total_actions TO action_count;
ALTER TABLE deck
  RENAME total_artifacts TO artifact_count;
ALTER TABLE deck
  RENAME total_upgrades TO upgrade_count;

CREATE INDEX deck_creature_count_idx ON deck(creature_count);
CREATE INDEX deck_action_count_idx ON deck(action_count);
CREATE INDEX deck_artifact_count_idx ON deck(artifact_count);
CREATE INDEX deck_upgrade_count_idx ON deck(upgrade_count);
