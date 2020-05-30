package coraythan.keyswap.decks.models

import com.fasterxml.jackson.annotation.JsonInclude
import coraythan.keyswap.House
import coraythan.keyswap.cards.Rarity

data class HouseAndCards(
        val house: House,
        val cards: List<SimpleCard>

)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class SimpleCard(
        val cardTitle: String,
        val rarity: Rarity,
        val legacy: Boolean? = null,
        val maverick: Boolean? = null,
        val anomaly: Boolean? = null,
        val enhanced: Boolean? = null
)
