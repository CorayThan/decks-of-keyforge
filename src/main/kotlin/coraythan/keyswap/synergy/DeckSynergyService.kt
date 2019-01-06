package coraythan.keyswap.synergy

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.decks.Deck
import coraythan.keyswap.decks.incrementValue
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

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

        addDeckTraits(deck, anyHouseCount)
        addHouseTraits(cards, counts)

        cards.forEach { card ->
            val cardInfo = card.extraCardInfo!!
            cardInfo.traits.forEach {
                val cardHouseCount = counts[card.house]!!
                anyHouseCount.incrementValue(it)
                cardHouseCount.incrementValue(it)
            }
        }
        val synergyCombos: List<SynergyCombo> = cards.mapNotNull { card ->
            val cardInfo = card.extraCardInfo ?: throw IllegalStateException("Oh no, ${card.cardTitle} had null extra info! $card")
            val positiveSynergies = cardInfo.synergies.filter { it.rating > 0 }
            val negativeSynergies = cardInfo.synergies.filter { it.rating < 0 }
            val maxRating = positiveSynergies.maxBy { it.rating }?.rating ?: 0
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
            val matchedTraits: List<Pair<SynTrait, Double>> = cardInfo.synergies.map { synTraitValue ->
                val matchWith = if (synTraitValue.type == SynTraitType.anyHouse) counts[null]!! else counts[card.house]!!
                // Max of 4 matches
                val matches = (matchWith[synTraitValue.trait] ?: 0).let { if (it > 4) 4 else it } -
                        (if (cardInfo.traits.contains(synTraitValue.trait)) 1 else 0)
                synTraitValue.trait to synTraitValue.synergyValue(matches)
            }
            if (matchedTraits.isEmpty()) {
                null
            } else {
                val synergy = matchedTraits.map { it.second }.filter { it > 0 }.sum()
                val antisynergy = matchedTraits.map { it.second }.filter { it < 0 }.sum()
                val netSynergy = synergy + antisynergy
                val limitedNetSynergy = when {
                    netSynergy > maxSynergy -> maxSynergy
                    netSynergy < minSynergy -> minSynergy
                    else -> netSynergy
                }
                val matchedSynergies = matchedTraits.filter { it.second > 0 }.map { it.first }
                val matchedAntisynergies = matchedTraits.filter { it.second < 0 }.map { it.first }
                if (matchedSynergies.isEmpty() && matchedAntisynergies.isEmpty()) {
                    null
                } else {
                    SynergyCombo(
                            house = card.house,
                            cardName = card.cardTitle,
                            synergies = matchedSynergies,
                            antisynergies = matchedAntisynergies,
                            netSynergy = limitedNetSynergy,
                            synergy = synergy,
                            antisynergy = antisynergy,
                            cardRating = card.extraCardInfo!!.rating - 1
                    )
                }
            }
        }

        val synergyValues = synergyCombos.map { it.netSynergy }
        val antisynergyRating = synergyValues.filter { it < 0 }.sum()
        val synergyRating = synergyValues.filter { it > 0 }.sum()

        val dedupedCombos: MutableList<SynergyCombo> = mutableListOf()
        val groupedCombos = synergyCombos.groupBy { it.house to it.cardName }
        groupedCombos.forEach { _, dups ->
            dedupedCombos.add(dups[0].copy(copies = dups.size))
        }

        return DeckSynergyInfo(
                synergyRating,
                antisynergyRating,
                dedupedCombos.sortedByDescending { it.cardRating + it.netSynergy }
        )
    }

    private fun addHouseTraits(cards: List<Card>, counts: MutableMap<House?, MutableMap<SynTrait, Int>>) {
        counts.forEach { house, houseTraits ->
            if (house != null) {
                val cardsForHouse = cards.filter { it.house == house }
                val totalCreaturePower = cardsForHouse.map { it.power }.sum()
                val creatureCount = cardsForHouse.filter { it.cardType == CardType.Creature }.size

                if (totalCreaturePower > 21) houseTraits[SynTrait.highTotalCreaturePower] = when {
                    totalCreaturePower > 23 -> 4
                    totalCreaturePower > 25 -> 3
                    totalCreaturePower > 27 -> 2
                    else -> 1
                }

                if (creatureCount > 6) houseTraits[SynTrait.highCreatureCount] = when {
                    creatureCount > 9 -> 4
                    creatureCount > 8 -> 3
                    creatureCount > 7 -> 2
                    else -> 1
                }

                if (creatureCount < 6) houseTraits[SynTrait.lowCreatureCount] = when {
                    creatureCount < 3 -> 4
                    creatureCount < 4 -> 3
                    creatureCount < 5 -> 2
                    else -> 1
                }
            }
        }
    }

    private fun addDeckTraits(deck: Deck, traits: MutableMap<SynTrait, Int>) {

        if (deck.houses.contains(House.Mars)) traits[SynTrait.hasMars] = 4

        if (deck.totalPower < 60) traits[SynTrait.lowTotalCreaturePower] = when {
            deck.totalPower < 47 -> 4
            deck.totalPower < 52 -> 3
            deck.totalPower < 57 -> 2
            else -> 1
        }

        if (deck.totalPower > 67) traits[SynTrait.highTotalCreaturePower] = when {
            deck.totalPower > 83 -> 4
            deck.totalPower > 77 -> 3
            deck.totalPower > 72 -> 2
            else -> 1
        }

        if (deck.totalArmor > 3) traits[SynTrait.highTotalArmor] = when {
            deck.totalArmor > 8 -> 4
            deck.totalArmor > 6 -> 3
            deck.totalArmor > 4 -> 2
            else -> 1
        }

        if (deck.totalArtifacts > 4) traits[SynTrait.highArtifactCount] = when {
            deck.totalArtifacts > 7 -> 4
            deck.totalArtifacts > 6 -> 3
            deck.totalArtifacts > 5 -> 2
            else -> 1
        }

        if (deck.totalArtifacts < 4) traits[SynTrait.lowArtifactCount] = when {
            deck.totalArtifacts < 1 -> 4
            deck.totalArtifacts < 2 -> 3
            deck.totalArtifacts < 3 -> 2
            else -> 1
        }

        if (deck.totalCreatures > 16) traits[SynTrait.highCreatureCount] = when {
            deck.totalCreatures > 20 -> 4
            deck.totalCreatures > 18 -> 3
            deck.totalCreatures > 17 -> 2
            else -> 1
        }

        if (deck.totalCreatures < 15) traits[SynTrait.lowCreatureCount] = when {
            deck.totalCreatures < 12 -> 4
            deck.totalCreatures < 13 -> 3
            deck.totalCreatures < 14 -> 2
            else -> 1
        }

        val power2OrLower = deck.cards.filter { it.cardType == CardType.Creature && it.power < 3 }.size
        val power3OrLower = deck.cards.filter { it.cardType == CardType.Creature && it.power < 4 }.size
        val power3OrHigher = deck.cards.filter { it.cardType == CardType.Creature && it.power > 2 }.size
        val power4OrHigher = deck.cards.filter { it.cardType == CardType.Creature && it.power > 3 }.size
        val power5OrHigher = deck.cards.filter { it.cardType == CardType.Creature && it.power > 4 }.size

        if (power2OrLower > 3) traits[SynTrait.power2OrLowerCreatures] = when {
            power2OrLower > 6 -> 4
            power2OrLower > 5 -> 3
            power2OrLower > 4 -> 2
            else -> 1
        }

        if (power3OrLower > 8) traits[SynTrait.power3OrLowerCreatures] = when {
            power3OrLower > 11 -> 4
            power3OrLower > 10 -> 3
            power3OrLower > 9 -> 2
            else -> 1
        }

        if (power3OrHigher > 12) traits[SynTrait.power3OrHigherCreatures] = when {
            power3OrHigher > 16 -> 4
            power3OrHigher > 14 -> 3
            power3OrHigher > 13 -> 2
            else -> 1
        }

        if (power4OrHigher > 8) traits[SynTrait.power4OrHigherCreatures] = when {
            power4OrHigher > 12 -> 4
            power4OrHigher > 10 -> 3
            power4OrHigher > 9 -> 2
            else -> 1
        }

        if (power5OrHigher > 5) traits[SynTrait.power5OrHigherCreatures] = when {
            power5OrHigher > 9 -> 4
            power5OrHigher > 7 -> 3
            power5OrHigher > 6 -> 2
            else -> 1
        }
    }
}