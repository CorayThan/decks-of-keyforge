package coraythan.keyswap.decks.models

import coraythan.keyswap.House

data class DeckSearchDetails(
        val houseSas: List<HouseSas>,
        val amberControlCards: List<CardSas>,
)

data class HouseSas(
        val house: House,
        val sas: Int,
        val cards: List<CardSas>
)

data class CardSas(
        val name: String,
        val count: Int?,
        val sas: Double
)
