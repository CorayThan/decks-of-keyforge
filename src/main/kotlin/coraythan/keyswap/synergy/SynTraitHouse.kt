package coraythan.keyswap.synergy

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
enum class SynTraitHouse {
    anyHouse,
    // Only synergizes with traits inside its house
    house,
    outOfHouse,
    continuous,
}
