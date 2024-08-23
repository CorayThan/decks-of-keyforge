package coraythan.keyswap.deckimports

import coraythan.keyswap.House
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs

data class DeckBuildingData(
        val cards: Map<House, List<TheoryCard>>,
        val name: String,
        val expansion: Expansion = Expansion.CALL_OF_THE_ARCHONS,
        val tokenTitle: String?,
        val alliance: Boolean = false,
)

@GenerateTs
data class TheoryCard(
        val name: String,
        val enhanced: Boolean = false,
        val bonusAmber: Int = 0,
        val bonusCapture: Int = 0,
        val bonusDamage: Int = 0,
        val bonusDraw: Int = 0,
        val bonusDiscard: Int = 0,
)
