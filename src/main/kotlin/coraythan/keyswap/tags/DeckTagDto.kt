package coraythan.keyswap.tags

import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class DeckTagDto(
        val tagId: Long,
        val deckId: Long,
)
