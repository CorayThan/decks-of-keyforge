package coraythan.keyswap.decks.compare

import coraythan.keyswap.alliancedecks.AllianceDeckService
import coraythan.keyswap.config.BadRequestException
import coraythan.keyswap.decks.DeckSearchService
import coraythan.keyswap.decks.models.DeckSearchResult
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*
import kotlin.math.absoluteValue

@Transactional
@Service
class DeckCompareService(
    private val deckSearchService: DeckSearchService,
    private val allianceDeckService: AllianceDeckService,
) {


    /**
     * Match Up Score
     *
     * Key things to rate:
     *
     * Requires new deck metric:
     * burst aember dependent vs. scaling aember control
     * creature static / use value vs. creature controlling
     * creature rush vs. board wipes
     * artifact dependent vs. artifact controlling
     *
     *
     * Counter cards:
     *
     * Counters Actions -------------
     * Counters Steal --------------- Discombobulator
     * Counters Discard ------------- Auto-Encoder
     * Counters Multiple copies ----- Etan's Jar
     * Counters Reaping ------------- Aember Imp, Ragwarg, Little Rapscal, Opposition Research
     * Counters Fighting ------------
     * Counters Elusive -------------
     * Counters specific House ------ King of the Crag, Take that, Smartypants, Painmail, E'e on the Fringes, Hecatomb
     * Counters creature power range- Warrior's Refrain, Autocannon, Earthshaker, Bellowing Patrizate, Hebe the Huge, Pingle Who Annoys, Phoenix Heart, Onyx Knight,
     * Counters shared houses ------- Gleeful Mayhem, Collar of Subordinat ion, Overlord Greking
     * Counters aember capture ------ Guilty Hearts
     * Counters creature recursion -- Annihilation Ritual, Eater of the Dead
     * Counters recursion ----------- Creeping Oblivion
     * Counters creature trait ------ XXXX's Bane, Krrrzzzzaaaap
     *
     * Buffs creature power range --- Grump Buggy
     * Buffs creature trait --------- Professor Terato,
     * Buffs good on play creatures - Hysteria, Mind Over Matter
     */

    fun compareDecks(decks: DecksToCompareDto): List<DeckCompareResults> {
        if ((decks.deckIds.size + decks.allianceDeckIds.size) < 2) throw BadRequestException("Not enough decks to compare.")

        val archonDecks = decks.deckIds.map { deckSearchService.findDeckWithSynergies(it)!!.deck }
        val allianceDecks =
            decks.allianceDeckIds.map { allianceDeckService.findAllianceDeckWithSynergies(UUID.fromString(it))!!.deck }

        val comparableDecks = archonDecks
            .plus(allianceDecks)

        return comparableDecks
            .map {
                compareDeck(it, comparableDecks)
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
                compareStats(deckToCompare, decks, "Artifact Count", 3.0) { deck ->
                    deck.artifactCount?.toDouble() ?: 0.0
                },
                compareStats(deckToCompare, decks, "Creature Count", 5.0) { deck ->
                    deck.creatureCount?.toDouble() ?: 0.0
                },
            )
        )
    }

    private fun compareStats(
        deck: DeckSearchResult,
        decks: List<DeckSearchResult>,
        stat: String,
        significantDifference: Double,
        statAccessor: (deck: DeckSearchResult) -> Double
    ): DeckCompareValue {
        val decksMinusThis = decks.minus(deck)
        val maxStat: Double = decksMinusThis.map(statAccessor).maxOrNull()!!
        val minStat: Double = decksMinusThis.map(statAccessor).minOrNull()!!
        val thisStat: Double = statAccessor(deck)

        val diff = if (thisStat > maxStat) {
            thisStat - maxStat
        } else if (thisStat < minStat) {
            thisStat - minStat
        } else {
            0.0
        }

        return DeckCompareValue(
            stat,
            diff,
            when {
                diff.absoluteValue >= significantDifference -> DifferenceAmount.SIGNIFICANT
                diff.absoluteValue >= (significantDifference / 2.0) -> DifferenceAmount.MODERATE
                else -> DifferenceAmount.MINIMAL
            }
        )
    }
}