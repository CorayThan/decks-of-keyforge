package coraythan.keyswap.decks.models

import coraythan.keyswap.House
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs

data class DeckBuildingData(
        val cards: Map<House, List<TheoryCard>>,
        val name: String,
        val expansion: Expansion = Expansion.CALL_OF_THE_ARCHONS,
        val tokenId: String?,
)

@GenerateTs
data class TheoryCard(
        val name: String,
        val enhanced: Boolean = false
)
