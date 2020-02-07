UPDATE card_traits
SET traits = upper(traits);

ALTER TABLE spoiler
    RENAME COLUMN traits TO traits_string;
