package coraythan.keyswap.decks

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.cards.SynTrait
import coraythan.keyswap.cards.SynTraitType
import coraythan.keyswap.cards.SynTraitValue
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

data class SynergyCombo(
        val cardName: String,
        val synergies: List<SynTrait>,
        val antisynergies: List<SynTrait>,
        val netSynergy: Double
)

data class DeckSynergyInfo(
        val synergyRating: Double,
        val antisynergyRating: Double,
        val synergyCombos: List<SynergyCombo>
)

@Service
class DeckSynergyService(
        val cardService: CardService
) {

    private val log = LoggerFactory.getLogger(this::class.java)

    fun fromDeck(deck: Deck): DeckSynergyInfo {
        val cards = cardService.fullCardsFromCards(deck.cards)
        val counts: MutableMap<House?, MutableMap<SynTrait, Int>> = mutableMapOf()
        deck.houses.forEach { counts[it] = mutableMapOf() }
        counts[null] = mutableMapOf()
        val anyHouseCount = counts[null]!!
        cards.forEach { card ->
            val cardInfo = card.extraCardInfo!!
            cardInfo.traits.forEach {
                val cardHouseCount = counts[card.house]!!
                if (anyHouseCount[it] == null) {
                    anyHouseCount[it] = 1
                } else {
                    anyHouseCount[it] = anyHouseCount[it]!! + 1
                }
                if (cardHouseCount[it] == null) {
                    cardHouseCount[it] = 1
                } else {
                    cardHouseCount[it] = cardHouseCount[it]!! + 1
                }
            }
        }
        val synergyCombos: List<SynergyCombo> = cards.mapNotNull { card ->
            val cardInfo = card.extraCardInfo ?: throw IllegalStateException("Oh no, ${card.cardTitle} had null extra info! $card")
            var positiveSynergies: List<SynTraitValue>? = null
            try {

                positiveSynergies = cardInfo.synergies.filter { it.rating > 0 }
            } catch (ex: Exception) {
                log.info("Whaaaa? $card $cardInfo")
            }
            val negativeSynergies = cardInfo.synergies.filter { it.rating < 0 }
            val maxRating = positiveSynergies!!.maxBy { it.rating }?.rating ?: 0
            val minRating = negativeSynergies.minBy { it.rating }?.rating ?: 0
            val maxSynergy = when (maxRating) {
                0 -> 0.0
                1 -> 0.5
                else -> maxRating - 1.0
            }
            val minSynergy = when (minRating) {
                0 -> 0.0
                -1 -> -0.5
                else -> minRating + 1.0
            }
            val matchedTraits = cardInfo.synergies.map { synTraitValue ->
                val matchWith = if (synTraitValue.type == SynTraitType.anyHouse) counts[null]!! else counts[card.house]!!
                // Max of 4 matches
                val matches = (matchWith[synTraitValue.trait] ?: 0).let { if (it > 4) 4 else it }
                synTraitValue.trait to synTraitValue.synergyValue(matches)
            }
            if (matchedTraits.isEmpty()) {
                null
            } else {
                val netSynergy = matchedTraits.map { it.second }.sum()
                val limitedNetSynergy = if (netSynergy > maxSynergy) {
                    maxSynergy
                } else if (netSynergy < minSynergy) {
                    minSynergy
                } else {
                    netSynergy
                }
                SynergyCombo(
                        card.cardTitle,
                        matchedTraits.filter { it.second > 0 }.map { it.first },
                        matchedTraits.filter { it.second < 0 }.map { it.first },
                        limitedNetSynergy
                )
            }
        }

        val synergyValues = synergyCombos.map { it.netSynergy }
        val antisynergyRating = synergyValues.filter { it < 0 }.sum()
        val synergyRating = synergyValues.filter { it > 0 }.sum()

        return DeckSynergyInfo(
                synergyRating,
                antisynergyRating,
                synergyCombos
        )
    }
}
