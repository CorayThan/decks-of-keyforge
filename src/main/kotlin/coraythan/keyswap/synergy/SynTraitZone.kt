package coraythan.keyswap.synergy

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
enum class PlayZone {
    deck,
    hand,
    play,
    discard,
    purged,
    archives,
}
