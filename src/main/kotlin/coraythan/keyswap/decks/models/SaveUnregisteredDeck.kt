package coraythan.keyswap.decks.models

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.expansions.Expansion

data class SaveUnregisteredDeck(
        val cards: Map<House, List<Card>>,
        val name: String,
        val expansion: Expansion = Expansion.CALL_OF_THE_ARCHONS
)