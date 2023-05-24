package coraythan.keyswap.decks.models

import com.fasterxml.jackson.annotation.JsonInclude
import coraythan.keyswap.House
import coraythan.keyswap.cards.Rarity
import coraythan.keyswap.generatets.GenerateTs

@GenerateTs
data class HouseAndCards(
        val house: House,
        val cards: List<SimpleCard>

)

@GenerateTs
@JsonInclude(JsonInclude.Include.NON_NULL)
data class SimpleCard(
        val cardTitle: String,
        val rarity: Rarity? = null,
        val legacy: Boolean? = null,
        val maverick: Boolean? = null,
        val anomaly: Boolean? = null,
        val enhanced: Boolean? = null,
        val bonusIcons: BonusIcons? = null,
)

@GenerateTs
@JsonInclude(JsonInclude.Include.NON_NULL)
data class BonusIcons(
        val bonusAember: Int = 0,
        val bonusCapture: Int = 0,
        val bonusDamage: Int = 0,
        val bonusDraw: Int = 0,
)
