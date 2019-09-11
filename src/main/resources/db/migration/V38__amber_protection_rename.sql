ALTER TABLE deck
    RENAME COLUMN steal_prevention TO amber_protection;
ALTER INDEX deck_steal_prevention_idx RENAME TO deck_amber_protection_idx;
