package coraythan.keyswap.synergy

import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardService
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.decks.models.Deck
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.math.RoundingMode
import kotlin.math.absoluteValue

data class TraitMatchInfo(var matches: Int = 0, var cardNames: MutableList<String> = mutableListOf())

fun <T> MutableMap<T, TraitMatchInfo>.incrementTraitMatch(key: T, cardName: String) {
    if (this[key] == null) {
        this[key] = TraitMatchInfo(1, mutableListOf(cardName))
    } else {
        val value = this[key]!!
        value.matches++
        if (!value.cardNames.contains(cardName)) value.cardNames.add(cardName)
    }
}

data class SynergizedValue(val value: Double, val synergy: Double)

@Service
class DeckSynergyService(
        private val cardService: CardService
) {

    fun fromDeck(deck: Deck): DeckSynergyInfo {
        val cards = cardService.cardsForDeck(deck)
        return fromDeckWithCards(deck, cards)
    }

    companion object {
        private val log = LoggerFactory.getLogger(this::class.java)

        private fun ratingsToPercent(synRating: Int, traitStrength: TraitStrength): Int {
            return (if (synRating < 0) -1 else 1) * when (synRating.absoluteValue + traitStrength.value) {
                2 -> 10
                3 -> 15
                4 -> 25
                5 -> 33
                6 -> 50
                else -> {
                    log.warn("Bad ratings! $synRating $traitStrength")
                    0
                }
            }
        }

        private fun synergizedValue(totalSynPercent: Int, min: Double, max: Double?, hasPositive: Boolean, hasNegative: Boolean): SynergizedValue {
            return if (max.isZeroOrNull()) {
                SynergizedValue(min, 0.0)
            } else {
                val range = max!! - min

                // Divide by 200 if positive + negative so that 100% positive 0% negative maxes out synergy
                val synValue = (totalSynPercent * range) / (if (hasPositive && hasNegative) 200 else 100)
                val startingPoint = when {
                    hasPositive && hasNegative -> (range / 2) + min
                    hasPositive -> min
                    else -> max
                }
                val uncappedValue = synValue + startingPoint
                val value = when {
                    uncappedValue < min -> min
                    uncappedValue > max -> max
                    else -> uncappedValue
                }
                SynergizedValue(
                        value.toBigDecimal().setScale(1, RoundingMode.HALF_UP).toDouble(),
                        (value - startingPoint).toBigDecimal().setScale(1, RoundingMode.HALF_UP).toDouble()
                )
            }
        }

        fun fromDeckWithCards(deck: Deck, cards: List<Card>): DeckSynergyInfo {

            //
            val traitCounts: Map<TraitStrength, Map<House?, MutableMap<SynergyTrait, TraitMatchInfo>>> = TraitStrength.values()
                    .map { strength ->
                        strength to deck.houses.plus(null as House?).map { it to mutableMapOf<SynergyTrait, TraitMatchInfo>() }.toMap()
                    }
                    .toMap()
            val normalStrengthTraitCounts = traitCounts[TraitStrength.NORMAL] ?: error("Should have normal strength")

            addDeckTraits(deck, normalStrengthTraitCounts[null] ?: error("Should have normal strength null house"), cards)
            addHouseTraits(cards, normalStrengthTraitCounts)

            // Add traits from each card
            cards.forEach { card ->
                val cardInfo = card.extraCardInfo!!
                val cardSpecialTraits = card.traits.mapNotNull {
                    val trait = SynergyTrait.fromTrait(it)
                    if (trait == null) null else SynTraitValue(trait)
                }
                val cardAllTraits = cardInfo.traits.plus(cardSpecialTraits)
                cardAllTraits
                        .forEach {
                            val countsForStrength = traitCounts[it.strength()] ?: error("Should have counts for ${it.strength()}")
                            val countsForHouse = countsForStrength[card.house]
                                    ?: throw IllegalArgumentException("No house in deck for card ${card.cardTitle} house ${card.house}")
                            when {
                                it.type == SynTraitType.house ->
                                    // Trait is house only, only add to house
                                    countsForHouse.incrementTraitMatch(it.trait, card.cardTitle)
                                it.type == SynTraitType.outOfHouse ->
                                    // Trait is outside of house only, add to not-that-house
                                    countsForStrength.forEach { (house, houseCount) ->
                                        if (house != null && house != card.house) {
                                            houseCount.incrementTraitMatch(it.trait, card.cardTitle)
                                        }
                                    }
                                else -> {
                                    // Trait works for house or any house
                                    countsForStrength[null]?.incrementTraitMatch(it.trait, card.cardTitle)
                                    countsForHouse.incrementTraitMatch(it.trait, card.cardTitle)
                                }
                            }
                        }
            }

            val synergyCombos: List<SynergyCombo> = cards
                    .groupBy { it.id }
                    .map { cardsById ->
                        val count = cardsById.value.size
                        val card = cardsById.value[0]
                        val cardInfo = card.extraCardInfo ?: error("Oh no, ${card.cardTitle} had null extra info! $card")
                        val cardSpecialTraits = card.traits.mapNotNull {
                            val trait = SynergyTrait.fromTrait(it)
                            if (trait == null) null else SynTraitValue(trait)
                        }
                        val cardAllTraits = cardInfo.traits.plus(cardSpecialTraits)

                        val matchedTraits: List<SynergyMatch> = cardInfo.synergies.map { synTraitValue ->

                            val trait = synTraitValue.trait
                            val cardNames = mutableSetOf<String>()
                            val synPercent = traitCounts.map { entry ->
                                val traitStrength = entry.key
                                val counts = entry.value
                                val matches: Int = when {
                                    synTraitValue.type == SynTraitType.anyHouse -> {
                                        val matchInfo = counts[null]?.get(trait)
                                        if (matchInfo != null) {
                                            cardNames.addAll(matchInfo.cardNames)
                                            val matches = matchInfo.matches
                                            if (matches > 0 && cardAllTraits.containsTrait(synTraitValue.trait)) matches - 1 else matches
                                        } else {
                                            0
                                        }
                                    }
                                    synTraitValue.type == SynTraitType.house -> {
                                        val matchInfo = counts[card.house]?.get(trait)
                                        if (matchInfo != null) {
                                            cardNames.addAll(matchInfo.cardNames)
                                            val matches = matchInfo.matches
                                            if (matches > 0 && cardAllTraits.containsTrait(synTraitValue.trait)) matches - 1 else matches
                                        } else {
                                            0
                                        }
                                    }
                                    else -> {
                                        counts.filterKeys { it != null && it != card.house }.map { it.value[trait]?.matches ?: 0 }.sum()
                                    }
                                }

                                matches * ratingsToPercent(synTraitValue.rating, traitStrength)
                            }.sum()

                            SynergyMatch(trait, synPercent, cardNames)
                        }

                        val totalSynPercent = matchedTraits.map { it.percentSynergized }.sum()

                        val hasPositive = cardInfo.synergies.find { it.rating > 0 } != null
                        val hasNegative = cardInfo.synergies.find { it.rating < 0 } != null

                        val aValue = synergizedValue(totalSynPercent, cardInfo.amberControl, cardInfo.amberControlMax, hasPositive, hasNegative)
                        val eValue = synergizedValue(totalSynPercent, cardInfo.expectedAmber, cardInfo.expectedAmberMax, hasPositive, hasNegative)
                        // log.info("For card ${card.cardTitle} e value is $eValue expected aember ${cardInfo.expectedAmber}")
                        val rValue = synergizedValue(totalSynPercent, cardInfo.artifactControl, cardInfo.artifactControlMax, hasPositive, hasNegative)
                        val cValue = synergizedValue(totalSynPercent, cardInfo.creatureControl, cardInfo.creatureControlMax, hasPositive, hasNegative)
                        val fValue = synergizedValue(totalSynPercent, cardInfo.efficiency, cardInfo.efficiencyMax, hasPositive, hasNegative)
                        val pValue = synergizedValue(totalSynPercent, cardInfo.effectivePower.toDouble(), cardInfo.effectivePowerMax, hasPositive, hasNegative)
                        val dValue = synergizedValue(totalSynPercent, cardInfo.disruption, cardInfo.disruptionMax, hasPositive, hasNegative)
                        val hcValue = synergizedValue(totalSynPercent, cardInfo.houseCheating, cardInfo.houseCheatingMax, hasPositive, hasNegative)
                        val apValue = synergizedValue(totalSynPercent, cardInfo.amberProtection, cardInfo.amberProtectionMax, hasPositive, hasNegative)
                        val oValue = synergizedValue(totalSynPercent, cardInfo.other, cardInfo.otherMax, hasPositive, hasNegative)

                        val synergizedValues = listOf(
                                aValue,
                                eValue,
                                rValue,
                                cValue,
                                fValue,
                                pValue.copy(
                                        value = (pValue.value / 10).toBigDecimal().setScale(1, RoundingMode.HALF_UP).toDouble(),
                                        synergy = (pValue.synergy / 10).toBigDecimal().setScale(1, RoundingMode.HALF_UP).toDouble()
                                ),
                                dValue,
                                hcValue,
                                apValue,
                                oValue
                        )
                        val synergyValues = synergizedValues.map { it.synergy }

                        SynergyCombo(
                                house = card.house,
                                cardName = card.cardTitle,
                                synergies = matchedTraits,
                                netSynergy = synergyValues.sum(),
                                cardRating = synergizedValues.map { it.value }.sum(),
                                synergy = synergyValues.filter { it > 0 }.sum(),
                                antisynergy = synergyValues.filter { it < 0 }.sum(),

                                amberControl = aValue.value,
                                expectedAmber = eValue.value,
                                artifactControl = rValue.value,
                                creatureControl = cValue.value,
                                efficiency = fValue.value,
                                effectivePower = pValue.value.toInt(),

                                disruption = dValue.value,
                                houseCheating = hcValue.value,
                                amberProtection = apValue.value,
                                other = oValue.value,
                                copies = count
                        )
                    }

            return DeckSynergyInfo(
                    synergyRating = synergyCombos.map { it.synergy * it.copies }.sum(),
                    antisynergyRating = synergyCombos.map { it.antisynergy * it.copies }.sum(),
                    synergyCombos = synergyCombos.sortedByDescending { it.netSynergy }
            )

        }

        private fun addHouseTraits(cards: List<Card>, counts: Map<House?, MutableMap<SynergyTrait, TraitMatchInfo>>) {
            counts.forEach { (house, houseTraits) ->
                if (house != null) {
                    val cardsForHouse = cards.filter { it.house == house }
                    val totalCreaturePower = cardsForHouse.map { it.power }.sum()
                    val creatureCount = cardsForHouse.filter { it.cardType == CardType.Creature }.size
                    val totalExpectedAmber = cardsForHouse.map {
                        val max = it.extraCardInfo?.expectedAmberMax ?: 0.0
                        val min = it.extraCardInfo?.expectedAmber ?: 0.0
                        if (max == 0.0) min else (min + max) / 2
                    }.sum()
                    val upgradeCount = cardsForHouse.filter { it.cardType == CardType.Upgrade }.size

                    if (totalExpectedAmber > 7) houseTraits[SynergyTrait.highExpectedAmber] = TraitMatchInfo(when {
                        totalExpectedAmber > 10 -> 4
                        totalExpectedAmber > 9 -> 3
                        totalExpectedAmber > 8 -> 2
                        else -> 1
                    })
                    if (totalExpectedAmber < 7) houseTraits[SynergyTrait.lowExpectedAmber] = TraitMatchInfo(when {
                        totalExpectedAmber < 4 -> 4
                        totalExpectedAmber < 5 -> 3
                        totalExpectedAmber < 6 -> 2
                        else -> 1
                    })

                    if (totalCreaturePower > 21) houseTraits[SynergyTrait.highTotalCreaturePower] = TraitMatchInfo(when {
                        totalCreaturePower > 23 -> 4
                        totalCreaturePower > 25 -> 3
                        totalCreaturePower > 27 -> 2
                        else -> 1
                    })

                    if (upgradeCount > 0) houseTraits[SynergyTrait.upgradeCount] = TraitMatchInfo(when {
                        upgradeCount > 3 -> 4
                        upgradeCount > 2 -> 3
                        upgradeCount > 1 -> 2
                        else -> 1
                    })

                    if (creatureCount > 6) houseTraits[SynergyTrait.highCreatureCount] = TraitMatchInfo(when {
                        creatureCount > 9 -> 4
                        creatureCount > 8 -> 3
                        creatureCount > 7 -> 2
                        else -> 1
                    })

                    if (creatureCount < 6) houseTraits[SynergyTrait.lowCreatureCount] = TraitMatchInfo(when {
                        creatureCount < 3 -> 4
                        creatureCount < 4 -> 3
                        creatureCount < 5 -> 2
                        else -> 1
                    })
                }
            }
        }

        private fun addDeckTraits(deck: Deck, traits: MutableMap<SynergyTrait, TraitMatchInfo>, cards: List<Card>) {

            if (deck.houses.contains(House.Mars)) traits[SynergyTrait.hasMars] = TraitMatchInfo(4)

            val totalExpectedAmber = cards.map { it.extraCardInfo?.expectedAmber ?: 0.0 }.sum()
            if (totalExpectedAmber > 21) traits[SynergyTrait.highExpectedAmber] = TraitMatchInfo(when {
                totalExpectedAmber > 26 -> 4
                totalExpectedAmber > 25 -> 3
                totalExpectedAmber > 23 -> 2
                else -> 1
            })
            if (totalExpectedAmber < 19) traits[SynergyTrait.lowExpectedAmber] = TraitMatchInfo(when {
                totalExpectedAmber < 15 -> 4
                totalExpectedAmber < 17 -> 3
                totalExpectedAmber < 18 -> 2
                else -> 1
            })

            if (deck.totalPower < 60) traits[SynergyTrait.lowTotalCreaturePower] = TraitMatchInfo(when {
                deck.totalPower < 47 -> 4
                deck.totalPower < 52 -> 3
                deck.totalPower < 57 -> 2
                else -> 1
            })

            if (deck.totalPower > 67) traits[SynergyTrait.highTotalCreaturePower] = TraitMatchInfo(when {
                deck.totalPower > 83 -> 4
                deck.totalPower > 77 -> 3
                deck.totalPower > 72 -> 2
                else -> 1
            })

            if (deck.totalArmor > 3) traits[SynergyTrait.highTotalArmor] = TraitMatchInfo(when {
                deck.totalArmor > 8 -> 4
                deck.totalArmor > 6 -> 3
                deck.totalArmor > 4 -> 2
                else -> 1
            })

            if (deck.artifactCount > 4) traits[SynergyTrait.highArtifactCount] = TraitMatchInfo(when {
                deck.artifactCount > 7 -> 4
                deck.artifactCount > 6 -> 3
                deck.artifactCount > 5 -> 2
                else -> 1
            })

            if (deck.artifactCount < 4) traits[SynergyTrait.lowArtifactCount] = TraitMatchInfo(when {
                deck.artifactCount < 1 -> 4
                deck.artifactCount < 2 -> 3
                deck.artifactCount < 3 -> 2
                else -> 1
            })

            if (deck.artifactCount < 4) traits[SynergyTrait.lowArtifactCount] = TraitMatchInfo(when {
                deck.artifactCount < 1 -> 4
                deck.artifactCount < 2 -> 3
                deck.artifactCount < 3 -> 2
                else -> 1
            })

            if (deck.upgradeCount > 0) traits[SynergyTrait.upgradeCount] = TraitMatchInfo(when {
                deck.upgradeCount > 3 -> 4
                deck.upgradeCount > 2 -> 3
                deck.upgradeCount > 1 -> 2
                else -> 1
            })

            if (deck.creatureCount > 16) traits[SynergyTrait.highCreatureCount] = TraitMatchInfo(when {
                deck.creatureCount > 20 -> 4
                deck.creatureCount > 18 -> 3
                deck.creatureCount > 17 -> 2
                else -> 1
            })

            if (deck.creatureCount < 15) traits[SynergyTrait.lowCreatureCount] = TraitMatchInfo(when {
                deck.creatureCount < 12 -> 4
                deck.creatureCount < 13 -> 3
                deck.creatureCount < 14 -> 2
                else -> 1
            })

            val power1 = cards.filter { it.cardType == CardType.Creature && it.power == 1 }.size
            val power2OrLower = cards.filter { it.cardType == CardType.Creature && it.power < 3 }.size
            val power3OrLower = cards.filter { it.cardType == CardType.Creature && it.power < 4 }.size
            val power3OrHigher = cards.filter { it.cardType == CardType.Creature && it.power > 2 }.size
            val power4OrHigher = cards.filter { it.cardType == CardType.Creature && it.power > 3 }.size
            val power5OrHigher = cards.filter { it.cardType == CardType.Creature && it.power > 4 }.size

            if (power1 > 0) traits[SynergyTrait.power1Creatures] = TraitMatchInfo(when {
                power1 > 3 -> 4
                power1 > 2 -> 3
                power1 > 1 -> 2
                else -> 1
            })

            if (power2OrLower > 3) traits[SynergyTrait.power2OrLowerCreatures] = TraitMatchInfo(when {
                power2OrLower > 6 -> 4
                power2OrLower > 5 -> 3
                power2OrLower > 4 -> 2
                else -> 1
            })

            if (power3OrLower > 8) traits[SynergyTrait.power3OrLowerCreatures] = TraitMatchInfo(when {
                power3OrLower > 11 -> 4
                power3OrLower > 10 -> 3
                power3OrLower > 9 -> 2
                else -> 1
            })

            if (power3OrHigher > 12) traits[SynergyTrait.power3OrHigherCreatures] = TraitMatchInfo(when {
                power3OrHigher > 16 -> 4
                power3OrHigher > 14 -> 3
                power3OrHigher > 13 -> 2
                else -> 1
            })

            if (power4OrHigher > 8) traits[SynergyTrait.power4OrHigherCreatures] = TraitMatchInfo(when {
                power4OrHigher > 12 -> 4
                power4OrHigher > 10 -> 3
                power4OrHigher > 9 -> 2
                else -> 1
            })

            if (power5OrHigher > 5) traits[SynergyTrait.power5OrHigherCreatures] = TraitMatchInfo(when {
                power5OrHigher > 9 -> 4
                power5OrHigher > 7 -> 3
                power5OrHigher > 6 -> 2
                else -> 1
            })
        }
    }
}

fun Double?.isZeroOrNull() = this == null || this == 0.0
