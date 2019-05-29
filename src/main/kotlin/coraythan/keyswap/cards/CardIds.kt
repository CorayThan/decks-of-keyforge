package coraythan.keyswap.cards

import coraythan.keyswap.House

data class CardIds(
        val cardIds: Map<House, List<CardNumberSetPair>>
) {
    companion object {
        fun fromCards(cards: List<Card>): CardIds {
            if (cards.size != 36) throw IllegalArgumentException("Cards for card ids must be 36")
            return CardIds(cards.groupBy { it.house }.mapValues { it.value.map { CardNumberSetPair(it.expansion, it.cardNumber.toInt()) } })
        }
    }
}

data class CardNumberSetPair(
        val expansion: Int,
        // Leave this as an Int for now because 0 padding sucks
        val cardNumber: Int
)
