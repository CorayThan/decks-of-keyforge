package coraythan.keyswap.decks.models

import coraythan.keyswap.House
import coraythan.keyswap.expansions.Expansion

data class SaveUnregisteredDeck(
        val cards: Map<House, List<String>>,
        val name: String,
        val expansion: Expansion = Expansion.CALL_OF_THE_ARCHONS
)
