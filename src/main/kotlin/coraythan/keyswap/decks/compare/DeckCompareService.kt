package coraythan.keyswap.decks.compare

import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.DeckSearchService
import coraythan.keyswap.decks.models.DeckSearchResult
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.math.absoluteValue

@Transactional
@Service
class DeckCompareService(
        private val deckSearchService: DeckSearchService
) {

    fun compareDecks(deckIds: List<String>): List<DeckCompareResults> {
        if (deckIds.size < 2) throw BadRequestException("Not enough decks to compare.")

        val decks = deckIds.map { deckSearchService.findDeckWithSynergies(it)!!.deck }

        return decks.map {
            compareDeck(it, decks)
        }
    }

    private fun compareDeck(deckToCompare: DeckSearchResult, decks: List<DeckSearchResult>): DeckCompareResults {
        return DeckCompareResults(
                deckToCompare,
                listOf(
                        compareStats(deckToCompare, decks, "Aember Control", 5.0) { deck ->
                            deck.amberControl
                        },
                        compareStats(deckToCompare, decks, "Expected Aember", 10.0) { deck ->
                            deck.expectedAmber
                        },
                        compareStats(deckToCompare, decks, "Artifact Control", 1.5) { deck ->
                            deck.artifactControl ?: 0.0
                        },
                        compareStats(deckToCompare, decks, "Creature Control", 5.0) { deck ->
                            deck.creatureControl
                        },
                        compareStats(deckToCompare, decks, "Efficiency", 8.0) { deck ->
                            deck.efficiency ?: 0.0
                        },
                        compareStats(deckToCompare, decks, "Disruption", 5.0) { deck ->
                            deck.disruption ?: 0.0
                        },
                        compareStats(deckToCompare, decks, "Creature Count", 5.0) { deck ->
                            deck.creatureCount?.toDouble() ?: 0.0
                        },
                        compareStats(deckToCompare, decks, "Artifact Count", 3.0) { deck ->
                            deck.artifactCount?.toDouble() ?: 0.0
                        },
                )
                        .filterNotNull()
        )
    }

    private fun compareStats(
            deck: DeckSearchResult,
            decks: List<DeckSearchResult>,
            stat: String,
            significantDifference: Double,
            statAccessor: (deck: DeckSearchResult) -> Double
    ): DeckCompareValue? {
        val decksMinusThis = decks.minus(deck)
        val maxStat: Double = decksMinusThis.map(statAccessor).maxOrNull()!!
        val minStat: Double = decksMinusThis.map(statAccessor).minOrNull()!!
        val thisStat: Double = statAccessor(deck)

        val diff = if (thisStat > maxStat) {
            thisStat - maxStat
        } else if (thisStat < minStat) {
            thisStat - minStat
        } else {
            return null
        }
        val significantlyDifferent = diff.absoluteValue >= significantDifference

        return DeckCompareValue(
                stat,
                diff,
                significantlyDifferent
        )
    }
}