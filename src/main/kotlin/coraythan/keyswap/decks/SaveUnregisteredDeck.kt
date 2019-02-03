package coraythan.keyswap.decks

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card

data class SaveUnregisteredDeck(
        val cards: Map<House, List<Card>>,
        val name: String
)