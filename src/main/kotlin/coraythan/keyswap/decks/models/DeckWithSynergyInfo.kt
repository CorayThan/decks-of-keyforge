package coraythan.keyswap.decks.models

data class DeckWithSynergyInfo(
        val deck: DeckSearchResult,
        val synergyPercentile: Double,
        val antisynergyPercentile: Double
)