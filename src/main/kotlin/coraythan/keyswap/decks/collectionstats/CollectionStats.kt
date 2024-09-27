package coraythan.keyswap.decks.collectionstats

import coraythan.keyswap.House
import coraythan.keyswap.decks.models.DeckSearchResult
import coraythan.keyswap.decks.models.SimpleCard
import coraythan.keyswap.decks.models.SimpleDeckSearchResult
import coraythan.keyswap.expansions.Expansion
import coraythan.keyswap.generatets.GenerateTs
import coraythan.keyswap.stats.BarData
import kotlin.math.roundToInt

@GenerateTs
data class HouseCount(
        val house: House,
        val count: Int,
)

@GenerateTs
data class ThreeHousesCount(
        val houses: List<House>,
        val count: Int,
        val averageSas: Int,
        val highSas: SimpleDeckSearchResult?
)

@GenerateTs
data class SetCount(
        val set: Expansion,
        val count: Int,
        val highSas: SimpleDeckSearchResult?
)

@GenerateTs
data class CardCounts(
        val name: String,
        val count: Int,
        val setCounts: List<SetCount>,
        val mostInDeck: Int,
        val mav: Int,
        val anomaly: Int,
        val legacy: Int,
        val highSas: SimpleDeckSearchResult?
)

@GenerateTs
data class CollectionStats(
        val houseCounts: List<HouseCount>,
        val houseDeckCounts: List<ThreeHousesCount>,
        val cardCounts: List<CardCounts>,
        val sasValues: List<BarData>,
        val expansionCounts: List<BarData>,
        val deckCount: Int,
) {
    companion object {
        fun makeStats(decks: List<DeckSearchResult>): CollectionStats {

            val cardsToDecks = mutableMapOf<String, MutableList<DeckSearchResult>>()

            decks.forEach {
                it.housesAndCards.forEach { houseAndCards ->
                    houseAndCards.cards.forEach { card ->
                        if (cardsToDecks[card.cardTitle] == null) {
                            cardsToDecks[card.cardTitle] = mutableListOf()
                        }
                        val decksForCard = cardsToDecks[card.cardTitle]!!
                        if (!decksForCard.contains(it)) {
                            decksForCard.add(it)
                        }
                    }
                }
            }

            return CollectionStats(
                    deckCount = decks.size,
                    houseCounts = decks
                            .flatMap { it.housesAndCards.map { houseAndCards -> houseAndCards.house } }
                            .groupBy { it }
                            .map { HouseCount(it.key, it.value.size) }
                            .sortedBy { it.house },
                    expansionCounts = decks
                            .groupBy { it.expansion }
                            .map { BarData(it.key, it.value.size) }
                            .sortedBy { it.x as Expansion },
                    houseDeckCounts = decks
                            .groupBy { it.housesAndCards.map { houseAndCards -> houseAndCards.house } }
                            .map { ThreeHousesCount(
                                    it.key,
                                    it.value.size,
                                    it.value.map { it.sasRating }.average().roundToInt(),
                                    it.value.maxByOrNull { deck -> deck.sasRating }?.toSimpleResult()
                            ) },
                    cardCounts = cardsToDecks
                            .map { decksForCard ->
                                val cardDecks = decksForCard.value
                                val cards: List<SimpleCard> = cardDecks.flatMap {
                                    it.housesAndCards.flatMap { houseAndCards ->
                                        houseAndCards.cards.filter { simpleCard ->
                                            simpleCard.cardTitle == decksForCard.key
                                        }
                                    }
                                }
                                CardCounts(
                                        name = decksForCard.key,
                                        count = cards.size,
//                                        count = cardDecks.sumBy { it.housesAndCards.sumBy { it.cards.count { it.cardTitle == decksForCard.key } } },
                                        setCounts = cardDecks
                                                .groupBy { it.expansion }
                                                .map { SetCount(it.key, it.value.size, it.value.maxByOrNull { deck -> deck.sasRating }!!.toSimpleResult()) }
                                                .sortedBy { it.set },
                                        mostInDeck = cardDecks.maxOf {
                                            var count = 0
                                            it.housesAndCards.forEach { houseAndCards ->
                                                houseAndCards.cards.forEach { card ->
                                                    if (card.cardTitle == decksForCard.key) {
                                                        count++
                                                    }
                                                }
                                            }
                                            count
                                        },
                                        mav = cards.filter { it.maverick == true }.size,
                                        anomaly = cards.filter { it.anomaly == true }.size,
                                        legacy = cards.filter { it.legacy == true }.size,
                                        highSas = decksForCard.value.maxByOrNull { deck -> deck.sasRating }!!.toSimpleResult()
                                )
                            },
                    sasValues = decks.groupBy { it.sasRating }.map { BarData(it.key, it.value.size) }
            )
        }
    }
}
