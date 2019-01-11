package coraythan.keyswap.deckcard

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card

data class CardIds(
        val cardIds: Map<House, List<CardNumberSetPair>>
) {
    companion object {
        fun fromCards(cards: List<Card>) =
                CardIds(cards.groupBy { it.house }.mapValues { it.value.map { CardNumberSetPair(it.expansion, it.cardNumber) } })

    }
}

data class CardNumberSetPair(
        val expansion: Int,
        val cardNumber: Int
)
