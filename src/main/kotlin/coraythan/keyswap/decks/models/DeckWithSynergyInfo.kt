package coraythan.keyswap.decks.models

import coraythan.keyswap.synergy.DeckSynergyInfo

data class DeckWithSynergyInfo(
        val deck: DeckSearchResult,
        val deckSynergyInfo: DeckSynergyInfo,
        val cardRatingPercentile: Int,
        val synergyPercentile: Int,
        val antisynergyPercentile: Int,
        val sasPercentile: Int
)