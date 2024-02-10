package coraythan.keyswap.cards

import coraythan.keyswap.House
import coraythan.keyswap.cards.extrainfo.CardNumberSetPairOld
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs

data class CardIds(
    val cardIds: Map<House, List<CardNumberSetPairOld>>
) {
    companion object {
        fun fromCards(cards: List<Card>): CardIds {
            if (cards.size != 36) throw IllegalArgumentException("Cards for card ids must be 36")
            return CardIds(cards.groupBy { it.house }.mapValues { houseToCards ->
                houseToCards.value.map { CardNumberSetPairOld(it.expansion, it.cardNumber, it.enhanced) }
            })
        }
    }
}

@GenerateTs
data class CardNumberSetPair(
    val expansion: Expansion,
    val cardNumber: String,
)
