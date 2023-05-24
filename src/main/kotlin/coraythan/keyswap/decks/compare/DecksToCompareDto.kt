package coraythan.keyswap.decks.compare

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class DecksToCompareDto(
    val deckIds: List<String>,
    val allianceDeckIds: List<String>,
)
