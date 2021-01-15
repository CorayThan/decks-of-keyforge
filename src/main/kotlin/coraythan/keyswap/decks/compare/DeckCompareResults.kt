package coraythan.keyswap.decks.compare

import coraythan.keyswap.decks.models.DeckSearchResult
import coraythan.keyswap.generatets.GenerateTs

data class DeckCompareResults(
        val deck: DeckSearchResult,
        val values: List<DeckCompareValue>
)

data class DeckCompareValue(
        val stat: String,
        val valueDiff: Double,
        val significantlyDifferent: DifferenceAmount,
)

@GenerateTs
enum class DifferenceAmount {
    MINIMAL,
    MODERATE,
    SIGNIFICANT
}
