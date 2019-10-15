package coraythan.keyswap.decks.models

data class DeckWithSynergyInfo(
        val deck: DeckSearchResult,
        val cardRatingPercentile: Double,
        val synergyPercentile: Double,
        val antisynergyPercentile: Double
)