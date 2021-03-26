ALTER TABLE tournament
    ADD COLUMN registration_closed BOOLEAN;
UPDATE tournament
SET registration_closed = FALSE;
ALTER TABLE tournament
    ALTER COLUMN registration_closed SET NOT NULL;

ALTER TABLE tournament
    ADD COLUMN deck_choices_locked BOOLEAN;
UPDATE tournament
SET deck_choices_locked = FALSE;
ALTER TABLE tournament
    ALTER COLUMN deck_choices_locked SET NOT NULL;

ALTER TABLE tournament
    ADD COLUMN verify_participants BOOLEAN;
UPDATE tournament
SET verify_participants = FALSE;
ALTER TABLE tournament
    ALTER COLUMN verify_participants SET NOT NULL;

ALTER TABLE tournament_participant
    ADD COLUMN verified BOOLEAN;
UPDATE tournament_participant
SET verified = FALSE;
ALTER TABLE tournament_participant
    ALTER COLUMN verified SET NOT NULL;

ALTER TABLE key_forge_event
    ADD COLUMN minutes_per_round INT4;

ALTER TABLE tournament_round
    ADD COLUMN started_on TIMESTAMP;

ALTER TABLE tournament
    RENAME COLUMN type TO pairing_strategy;
UPDATE tournament
SET pairing_strategy = 'SWISS_SOS';

ALTER TABLE tournament_round
    ADD COLUMN paired_with_strategy VARCHAR(255);
UPDATE tournament_round
SET paired_with_strategy = 'SWISS_SOS';
ALTER TABLE tournament_round
    ALTER COLUMN paired_with_strategy SET NOT NULL;