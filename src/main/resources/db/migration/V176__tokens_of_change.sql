ALTER TABLE extra_card_info
    RENAME COLUMN enhancement_sky_born TO enhancement_skyborn;

ALTER TYPE house ADD VALUE 'Redemption';
ALTER TYPE house ADD VALUE 'Skyborn';
