package coraythan.keyswap.decks.models

import coraythan.keyswap.synergy.DeckSynergyInfo

data class DeckWithSynergyInfo(
        val deck: DeckSearchResult,
        val deckSynergyInfo: DeckSynergyInfo,
        val cardRatingPercentile: Double,
        val synergyPercentile: Double,
        val antisynergyPercentile: Double
)