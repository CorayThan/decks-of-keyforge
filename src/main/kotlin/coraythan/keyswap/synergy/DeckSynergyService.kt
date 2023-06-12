package coraythan.keyswap.synergy

import com.google.common.math.DoubleMath.roundToInt
import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.decks.models.GenericDeck
import coraythan.keyswap.roundToTwoSigDig
import org.slf4j.LoggerFactory
import java.math.RoundingMode
import kotlin.math.absoluteValue
import kotlin.math.roundToInt

object DeckSynergyService {
    private val log = LoggerFactory.getLogger(this::class.java)

    private fun ratingsToPercent(synRating: Int, traitStrength: TraitStrength): Int {
        return (if (synRating < 0) -1 else 1) * when (synRating.absoluteValue + traitStrength.value) {
            2 -> 2
            3 -> 5
            4 -> 10
            5 -> 15
            6 -> 25
            7 -> 33
            8 -> 50
            else -> {
                log.warn("Bad ratings! $synRating $traitStrength")
                0
            }
        }
    }

    private fun synergizedValue(
        totalSynPercent: Int,
        min: Double,
        max: Double?,
        hasPositive: Boolean,
        hasNegative: Boolean,
        baseSynPercent: Int?
    ): SynergizedValue {
        return if (max.isZeroOrNull()) {
            SynergizedValue(min, 0.0)
        } else {
            val range = max!! - min

            val divideBy = if (hasPositive && hasNegative && baseSynPercent == null) 200 else 100

            // Divide by 200 if positive + negative and no starting so that 100% positive 0% negative maxes out synergy
            val synValue = (totalSynPercent * range) / divideBy
            val startingPoint = when {
                baseSynPercent != null -> (range * (baseSynPercent.toDouble() / divideBy.toDouble())) + min
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
            val cappedStartPoint = if (startingPoint > max) max else if (startingPoint < min) min else startingPoint
//            log.info("Starting point: $startingPoint total percent: $totalSynPercent base $baseSynPercent min $min max $max syn value: $value range $range capped start $cappedStartPoint")
            SynergizedValue(value, value - cappedStartPoint)
        }
    }

    fun fromDeckWithCards(deck: GenericDeck, inputCards: List<Card>, token: Card?): DeckSynergyInfo {

        val cards = if (inputCards.any { it.big == true }) {
            inputCards
                .groupBy { it.cardTitle }
                .flatMap {
                    if (it.value.first().big == true) {
                        it.value.drop(it.value.size / 2)
                    } else {
                        it.value
                    }
                }
        } else {
            inputCards
        }

        val traitsMap = mutableMapOf<SynergyTrait, SynTraitValuesForTrait>()

        val cardsMap: Map<House, Map<String, Int>> = cards
            .groupBy { it.house }
            .map { cardsByHouse ->
                cardsByHouse.key to cardsByHouse.value.groupBy { it.cardTitle }.map { it.key to it.value.size }.toMap()
            }
            .toMap()

        // Add traits from each card
        cards.forEach { card ->
            val cardInfo = card.extraCardInfo!!
            val cardSpecialTraits = card.traits.mapNotNull {
                val trait = SynergyTrait.fromTrait(it)
                if (trait == null) null else SynTraitValue(trait)
            }
            val cardAllTraits = cardInfo.traits
                .plus(cardSpecialTraits)
                .let {
                    if (card.enhanced == true) {
                        it.plus(
                            SynTraitValue(
                                SynergyTrait.enhanced,
                                rating = 3,
                                cardTypesInitial = card.allTypes().toList()
                            )
                        )
                    } else {
                        it
                    }
                }
            cardAllTraits
                .forEach { traitValue ->
                    traitsMap.addTrait(traitValue, card, card.house)
                    if (traitValue.trait == SynergyTrait.uses && (traitValue.cardTypes.isEmpty() || traitValue.cardTypes.contains(
                            CardType.Creature
                        ))
                    ) {
                        traitsMap.addTrait(traitValue.copy(trait = SynergyTrait.causesReaping), card, card.house)
                        if (traitValue.rating > 1) {
                            traitsMap.addTrait(
                                traitValue.copy(
                                    trait = SynergyTrait.causesFighting,
                                    rating = traitValue.rating - 1
                                ), card, card.house
                            )
                        }
                    }
                }
            traitsMap.addTrait(SynTraitValue(SynergyTrait.any), card, card.house)
        }

        // log.info("Traits map is: ${ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(traitsMap)}")

        addDeckTraits(deck, traitsMap, cards)
        addHouseTraits(deck.houses, cards, traitsMap)
        addOutOfHouseTraits(deck.houses, cards, traitsMap)

        val selfEnhancedCombos: List<SynergyCombo> = cards
            .mapNotNull { card ->
                var selfEnhancedCombo: SynergyCombo? = null
                if (card.enhanced == true) {
                    val syn = card.extraCardInfo?.synergies?.firstOrNull { it.trait == SynergyTrait.selfEnhanced }
                    if (syn != null) {
                        val value = when (syn.rating) {
                            -4 -> -1.5
                            -3 -> -1.0
                            -2 -> -0.5
                            -1 -> -0.25
                            1 -> 0.25
                            2 -> 0.5
                            3 -> 1.0
                            4 -> 1.5
                            else -> throw IllegalStateException("Unexpected syn rating: ${syn.rating}")
                        }
                        selfEnhancedCombo = SynergyCombo(
                            house = card.house,
                            cardName = card.cardTitle + " Enhanced",
                            synergies = listOf(SynergyMatch(syn, 100, setOf())),
                            netSynergy = value,
                            aercScore = value,

                            amberControl = 0.0,
                            expectedAmber = 0.0,
                            artifactControl = 0.0,
                            creatureControl = 0.0,
                            efficiency = 0.0,
                            recursion = 0.0,
                            effectivePower = 0,

                            disruption = 0.0,
                            creatureProtection = 0.0,
                            other = value,
                            copies = 1,

                            notCard = true
                        )
                    }
                }
                selfEnhancedCombo
            }
            .groupBy { it.cardName }
            .map { it.value.first().copy(copies = it.value.size) }

        val synergyCombos: List<SynergyCombo> = cards
            .groupBy { Pair(it.cardTitle, it.house) }
            .map { cardsById ->
                val count = cardsById.value.size
                val card = cardsById.value[0]
                val cardInfo = card.extraCardInfo ?: error("Oh no, ${card.cardTitle} had null extra info! $card")

                val matchedTraits: Map<String?, List<SynergyMatch>> = cardInfo.synergies
                    .map { synergy ->

                        val synergyTrait = synergy.trait
                        val cardNames = mutableSetOf<String>()
                        val synPercent = TraitStrength.values().map { strength ->
                            val matches = if (synergy.cardName == null) {
                                traitsMap[synergyTrait]?.matches(card, synergy)
                            } else {
                                val cardCount = when (synergy.house) {
                                    SynTraitHouse.anyHouse -> cardsMap.map {
                                        it.value.getOrDefault(
                                            synergy.cardName,
                                            0
                                        )
                                    }.sum()

                                    SynTraitHouse.house -> cardsMap[card.house]?.get(synergy.cardName) ?: 0
                                    else -> cardsMap.entries.filter { it.key != card.house }
                                        .map { it.value.getOrDefault(synergy.cardName, 0) }.sum()
                                }
                                if (cardCount != 0) {
                                    SynMatchInfo(mapOf(TraitStrength.NORMAL to if (card.cardTitle == synergy.cardName) cardCount - 1 else cardCount))
                                } else {
                                    null
                                }
                            }
                            if (matches == null) {
                                0
                            } else {
                                cardNames.addAll(matches.cardNames)
                                val matchesAtStrength = matches.matches[strength] ?: 0
                                // log.info("${card.cardTitle}: $synergyTrait syn rating: ${synergy.rating} $strength = $matchesAtStrength")
                                matchesAtStrength * ratingsToPercent(synergy.rating, strength)
                            }
                        }.sum()

                        SynergyMatch(synergy, synPercent, cardNames)
                    }.groupBy { it.trait.synergyGroup }

                var generalGroupMax = 1000

                val groupSynPercents = matchedTraits.map { groupSyns ->
                    val isPrimary = groupSyns.value.any { it.trait.primaryGroup }
                    val groupMax = groupSyns.value.find { it.trait.synergyGroupMax != 0 }?.trait?.synergyGroupMax
                    val groupSynergy = groupSyns.value.map { it.percentSynergized }.sum()
                    if (isPrimary) {
                        generalGroupMax = groupSynergy
                    }
                    if (groupMax == null) {
                        groupSynergy
                    } else if ((groupMax in 1 until groupSynergy) || (groupMax in (groupSynergy + 1)..-1)) {
                        groupMax
                    } else {
                        groupSynergy
                    }
                }

                val groupSynPercentsMaxReduced = if (generalGroupMax == 1000) {
                    groupSynPercents
                } else {
                    groupSynPercents.map { if (it > generalGroupMax) generalGroupMax else it }
                }

                val totalSynPercent = groupSynPercentsMaxReduced.sum()

                val hasPositive = cardInfo.synergies.find { it.rating > 0 } != null
                val hasNegative = cardInfo.synergies.find { it.rating < 0 } != null

                val aValue = synergizedValue(
                    totalSynPercent,
                    cardInfo.amberControl,
                    cardInfo.amberControlMax,
                    hasPositive,
                    hasNegative,
                    cardInfo.baseSynPercent
                )
                val eValue = synergizedValue(
                    totalSynPercent,
                    cardInfo.expectedAmber,
                    cardInfo.expectedAmberMax,
                    hasPositive,
                    hasNegative,
                    cardInfo.baseSynPercent
                )
                // log.info("For card ${card.cardTitle} e value is $eValue expected aember ${cardInfo.expectedAmber}")
                val rValue = synergizedValue(
                    totalSynPercent,
                    cardInfo.artifactControl,
                    cardInfo.artifactControlMax,
                    hasPositive,
                    hasNegative,
                    cardInfo.baseSynPercent
                )
                val cValue = synergizedValue(
                    totalSynPercent,
                    cardInfo.creatureControl,
                    cardInfo.creatureControlMax,
                    hasPositive,
                    hasNegative,
                    cardInfo.baseSynPercent
                )
                val fValue = synergizedValue(
                    totalSynPercent,
                    cardInfo.efficiency,
                    cardInfo.efficiencyMax,
                    hasPositive,
                    hasNegative,
                    cardInfo.baseSynPercent
                )
                val uValue = synergizedValue(
                    totalSynPercent,
                    cardInfo.recursion,
                    cardInfo.recursionMax,
                    hasPositive,
                    hasNegative,
                    cardInfo.baseSynPercent
                )
                val pValue =
                    if (cardInfo.effectivePower == 0 && (cardInfo.effectivePowerMax == null || cardInfo.effectivePowerMax == 0.0)) {
                        SynergizedValue(card.effectivePower.toDouble(), 0.0)
                    } else {
                        synergizedValue(
                            totalSynPercent,
                            cardInfo.effectivePower.toDouble(),
                            cardInfo.effectivePowerMax,
                            hasPositive,
                            hasNegative,
                            cardInfo.baseSynPercent
                        )
                    }
                val dValue = synergizedValue(
                    totalSynPercent,
                    cardInfo.disruption,
                    cardInfo.disruptionMax,
                    hasPositive,
                    hasNegative,
                    cardInfo.baseSynPercent
                )
                val apValue = synergizedValue(
                    totalSynPercent,
                    cardInfo.creatureProtection,
                    cardInfo.creatureProtectionMax,
                    hasPositive,
                    hasNegative,
                    cardInfo.baseSynPercent
                )
                val oValue = synergizedValue(
                    totalSynPercent,
                    cardInfo.other,
                    cardInfo.otherMax,
                    hasPositive,
                    hasNegative,
                    cardInfo.baseSynPercent
                )

                val synergizedValues = listOf(
                    aValue,
                    eValue,
                    rValue,
                    cValue,
                    fValue,
                    uValue,
                    pValue.copy(
                        value = (pValue.value / 10).toBigDecimal().setScale(1, RoundingMode.HALF_UP).toDouble(),
                        synergy = (pValue.synergy / 10).toBigDecimal().setScale(1, RoundingMode.HALF_UP).toDouble()
                    ),
                    dValue,
                    apValue,
                    oValue
                )
                val synergyValues = synergizedValues.map { it.synergy }

                SynergyCombo(
                    house = card.house,
                    cardName = card.cardTitle,
                    synergies = matchedTraits.values.flatten()
                        .sortedBy { it.trait.synergyGroup },
                    netSynergy = synergyValues.sum(),
                    aercScore = synergizedValues.map { it.value }
                        .sum() + (if (card.cardType == CardType.Creature) 0.4 else 0.0),

                    amberControl = aValue.value,
                    expectedAmber = eValue.value,
                    artifactControl = rValue.value,
                    creatureControl = cValue.value,
                    efficiency = fValue.value,
                    recursion = uValue.value,
                    effectivePower = pValue.value.toInt(),

                    disruption = dValue.value,
                    creatureProtection = apValue.value,
                    other = oValue.value,
                    copies = count,
                    synStart = cardInfo.baseSynPercent
                )
            }
            .plus(selfEnhancedCombos)

        val a = synergyCombos.map { it.amberControl * it.copies }.sum()
        val e = synergyCombos.map { it.expectedAmber * it.copies }.sum()
        val r = synergyCombos.map { it.artifactControl * it.copies }.sum()
        val c = synergyCombos.map { it.creatureControl * it.copies }.sum()
        val f = synergyCombos.map { it.efficiency * it.copies }.sum()
        val u = synergyCombos.map { it.recursion * it.copies }.sum()
        val d = synergyCombos.map { it.disruption * it.copies }.sum()
        val p = synergyCombos.map { it.effectivePower * it.copies }.sum()
        val o = synergyCombos.map { it.other * it.copies }.sum()
        val cp = synergyCombos.map { it.creatureProtection * it.copies }.sum()

        val creatureCount = cards.filter { it.cardType == CardType.Creature }.size
        val powerValue = p.toDouble() / 10.0


        // Remember! When updating this also update Card
        val synergyUnroundedRaw = synergyCombos.filter { it.netSynergy > 0 }.map { it.netSynergy * it.copies }.sum()

        val antiSynergyToRound = synergyCombos.filter { it.netSynergy < 0 }.map { it.netSynergy * it.copies }.sum()
        val antisynergy = roundToInt(antiSynergyToRound, RoundingMode.HALF_UP).absoluteValue
        val preMetaSas = a + e + r + c + f + u + d + cp + o + powerValue + (creatureCount.toDouble() * 0.4)

        val efficiencyBonus = calculateEfficiencyBonus(synergyCombos, preMetaSas)

        val scalingAemberControlTraits =
            traitsMap[SynergyTrait.scalingAmberControl]?.traitValues?.map { it.value.strength().value }?.sum() ?: 0
        val destroys = traitsMap[SynergyTrait.destroys]?.traitValues ?: listOf()
        val purges = traitsMap[SynergyTrait.purges]?.traitValues ?: listOf()
        val artifactDestroyTraits = destroys
            .filter {
                it.value.player != SynTraitPlayer.FRIENDLY &&
                        (it.value.cardTypes.contains(CardType.Artifact) || it.value.cardTypes.isEmpty())
            }
        val artifactPurgeTraits = purges
            .filter {
                it.card?.cardTitle == "Harvest Time" ||
                        it.card?.cardTitle == "Reclaimed by Nature"
            }

        val hardRScore = artifactDestroyTraits.plus(artifactPurgeTraits).map { it.value.rating }.sum()
        val boardWipeScore =
            traitsMap[SynergyTrait.boardClear]?.traitValues?.map { it.value.strength().value }?.sum() ?: 0

        val metaScores = mapOf<String, Double>(
            "Aember Control" to when {
                a < 2 -> -4.0
                a < 3 -> -3.0
                a < 4 -> -2.0
                a < 5 -> -1.0
                else -> 0.0
            },
            "Creature Control" to when {
                c < 2 -> -4.0
                c < 4 -> -3.0
                c < 6 -> -2.0
                c < 7 -> -1.0
                else -> 0.0
            },
            "Artifact Control" to when {
                hardRScore > 2 -> 1.0
                else -> 0.0
            },
            "Board Clears" to when {
                boardWipeScore > 2 -> 1.0
                else -> 0.0
            },
            "Scaling Aember Control" to when {
                scalingAemberControlTraits > 2 -> 1.0
                else -> 0.0
            },
        )

        val metaScore = metaScores.values.sum()

        val synergy = (synergyUnroundedRaw + efficiencyBonus).roundToInt()

        val newSas = (preMetaSas + metaScore + efficiencyBonus).roundToInt()
        val rawAerc = newSas + antisynergy - synergy - metaScore.roundToInt()

        // log.info("a: $a e $e r $r c $c f $f u $u p $powerValue d $d cp $cp o $o creature value ${(creatureCount.toDouble() * 0.4)} meta: $metaScore FB: $efficiencyBonus PreMetaSAS: $preMetaSas SAS: $newSas")

        return DeckSynergyInfo(
            synergyRating = synergy,
            antisynergyRating = antisynergy,
            synergyCombos = synergyCombos.sortedByDescending { it.netSynergy },
            rawAerc = rawAerc,
            sasRating = newSas,

            amberControl = a,
            expectedAmber = e,
            artifactControl = r,
            creatureControl = c,
            efficiency = f,
            recursion = u,
            effectivePower = p,
            disruption = d,
            creatureProtection = cp,
            other = o,

            metaScores = metaScores,
            efficiencyBonus = efficiencyBonus,
        )
    }

    private fun calculateEfficiencyBonus(combos: List<SynergyCombo>, sas: Double): Double {
        return combos
            .filter { it.efficiency > 0 }
            .map { combo ->
                val f = combo.efficiency
                val efficiencyBonus = (f * (((sas - combo.aercScore) / 35) * 0.4) / 0.75) - f
                // log.info("FB $efficiencyBonus x copies ${combo.copies}")
                efficiencyBonus * combo.copies
            }
            .sum()
    }

    private fun addOutOfHouseTraits(
        houses: List<House>,
        cards: List<Card>,
        traits: MutableMap<SynergyTrait, SynTraitValuesForTrait>
    ) {
        houses.forEach { house ->
            val cardsNotForHouse = cards.filter { it.house != house }
            val creatureCount = cardsNotForHouse.filter { it.cardType == CardType.Creature }.size

            if (creatureCount > 12) traits.addDeckTrait(
                SynergyTrait.highCreatureCount, when {
                    creatureCount > 16 -> 4
                    creatureCount > 15 -> 3
                    creatureCount > 14 -> 2
                    else -> 1
                }, house, SynTraitHouse.outOfHouse
            )

            if (creatureCount < 10) traits.addDeckTrait(
                SynergyTrait.lowCreatureCount, when {
                    creatureCount < 6 -> 4
                    creatureCount < 7 -> 3
                    creatureCount < 8 -> 2
                    else -> 1
                }, house, SynTraitHouse.outOfHouse
            )
        }
    }

    private fun addHouseTraits(
        houses: List<House>,
        cards: List<Card>,
        traits: MutableMap<SynergyTrait, SynTraitValuesForTrait>
    ) {
        houses.forEach { house ->
            val cardsForHouse = cards.filter { it.house == house }
            val totalCreaturePower = cardsForHouse.map { it.power }.sum()
            val creatureCount = cardsForHouse.filter { it.cardType == CardType.Creature }.size
            val artifactCount = cardsForHouse.filter { it.cardType == CardType.Artifact }.size
            val upgradeCount = cardsForHouse.filter { it.cardType == CardType.Upgrade }.size

            val bonusAmber = cardsForHouse.map { it.amber }.sum()
            traits.addDeckTrait(
                SynergyTrait.bonusAmber,
                bonusAmber,
                house,
                SynTraitHouse.house,
                strength = TraitStrength.EXTRA_WEAK
            )

            val totalExpectedAmber = cardsForHouse.map {
                val max = it.extraCardInfo?.expectedAmberMax ?: 0.0
                val min = it.extraCardInfo?.expectedAmber ?: 0.0
                if (max == 0.0) min else (min + max) / 2
            }.sum()
            val totalArmor = cardsForHouse.map { it.armor }.sum()

            if (totalExpectedAmber > 7) traits.addDeckTrait(
                SynergyTrait.highExpectedAmber, when {
                    totalExpectedAmber > 10 -> 4
                    totalExpectedAmber > 9 -> 3
                    totalExpectedAmber > 8 -> 2
                    else -> 1
                }, house, SynTraitHouse.house
            )
            if (totalExpectedAmber < 7) traits.addDeckTrait(
                SynergyTrait.lowExpectedAmber, when {
                    totalExpectedAmber < 4 -> 4
                    totalExpectedAmber < 5 -> 3
                    totalExpectedAmber < 6 -> 2
                    else -> 1
                }, house, SynTraitHouse.house
            )

            if (totalCreaturePower > 21) traits.addDeckTrait(
                SynergyTrait.highTotalCreaturePower, when {
                    totalCreaturePower > 27 -> 4
                    totalCreaturePower > 25 -> 3
                    totalCreaturePower > 23 -> 2
                    else -> 1
                }, house, SynTraitHouse.house
            )

            if (totalCreaturePower < 20) traits.addDeckTrait(
                SynergyTrait.lowTotalCreaturePower, when {
                    totalCreaturePower < 14 -> 4
                    totalCreaturePower < 16 -> 3
                    totalCreaturePower < 18 -> 2
                    else -> 1
                }, house, SynTraitHouse.house
            )

            if (upgradeCount > 0) traits.addDeckTrait(
                SynergyTrait.upgradeCount, when {
                    upgradeCount > 3 -> 4
                    upgradeCount > 2 -> 3
                    upgradeCount > 1 -> 2
                    else -> 1
                }, house, SynTraitHouse.house
            )

            if (creatureCount > 6) traits.addDeckTrait(
                SynergyTrait.highCreatureCount, when {
                    creatureCount > 9 -> 4
                    creatureCount > 8 -> 3
                    creatureCount > 7 -> 2
                    else -> 1
                }, house, SynTraitHouse.house
            )

            if (creatureCount < 6) traits.addDeckTrait(
                SynergyTrait.lowCreatureCount, when {
                    creatureCount < 3 -> 4
                    creatureCount < 4 -> 3
                    creatureCount < 5 -> 2
                    else -> 1
                }, house, SynTraitHouse.house
            )

            if (artifactCount > 2) traits.addDeckTrait(
                SynergyTrait.highArtifactCount, when {
                    artifactCount > 3 -> 4
                    else -> 2
                }, house, SynTraitHouse.house
            )

            if (artifactCount < 2) traits.addDeckTrait(
                SynergyTrait.lowArtifactCount, when {
                    artifactCount < 1 -> 4
                    else -> 2
                }, house, SynTraitHouse.house
            )

            if (totalArmor > 1) traits.addDeckTrait(
                SynergyTrait.highTotalArmor, when {
                    totalArmor > 5 -> 4
                    totalArmor > 4 -> 3
                    totalArmor > 3 -> 2
                    else -> 1
                }, house, SynTraitHouse.house
            )
        }
    }

    private fun addDeckTraits(
        deck: GenericDeck,
        traits: MutableMap<SynergyTrait, SynTraitValuesForTrait>,
        cards: List<Card>
    ) {

        if (deck.houses.contains(House.Mars)) traits.addDeckTrait(SynergyTrait.hasMars, 4)

        val bonusAmber = cards.map { it.amber + (it.extraCardInfo?.enhancementAmber ?: 0) }.sum()
        val bonusCapture = cards.mapNotNull { it.extraCardInfo?.enhancementCapture }.sum()
        val bonusDraw = cards.mapNotNull { it.extraCardInfo?.enhancementDraw }.sum()
        val bonusDamage = cards.mapNotNull { it.extraCardInfo?.enhancementDamage }.sum()

        traits.addDeckTrait(SynergyTrait.bonusAmber, bonusAmber, strength = TraitStrength.EXTRA_WEAK)
        traits.addDeckTrait(SynergyTrait.bonusCapture, bonusCapture, strength = TraitStrength.EXTRA_WEAK)
        traits.addDeckTrait(SynergyTrait.bonusDraw, bonusDraw, strength = TraitStrength.EXTRA_WEAK)
        traits.addDeckTrait(SynergyTrait.bonusDamage, bonusDamage, strength = TraitStrength.EXTRA_WEAK)

        val totalExpectedAmber = cards.map { it.extraCardInfo?.expectedAmber ?: 0.0 }.sum()
        if (totalExpectedAmber > 21) traits.addDeckTrait(
            SynergyTrait.highExpectedAmber, when {
                totalExpectedAmber > 26 -> 4
                totalExpectedAmber > 25 -> 3
                totalExpectedAmber > 23 -> 2
                else -> 1
            }
        )
        if (totalExpectedAmber < 19) traits.addDeckTrait(
            SynergyTrait.lowExpectedAmber, when {
                totalExpectedAmber < 15 -> 4
                totalExpectedAmber < 17 -> 3
                totalExpectedAmber < 18 -> 2
                else -> 1
            }
        )

        if (deck.totalPower < 60) traits.addDeckTrait(
            SynergyTrait.lowTotalCreaturePower, when {
                deck.totalPower < 47 -> 4
                deck.totalPower < 52 -> 3
                deck.totalPower < 57 -> 2
                else -> 1
            }
        )
        if (deck.totalPower > 67) traits.addDeckTrait(
            SynergyTrait.highTotalCreaturePower, when {
                deck.totalPower > 83 -> 4
                deck.totalPower > 77 -> 3
                deck.totalPower > 72 -> 2
                else -> 1
            }
        )

        if (deck.totalArmor > 3) traits.addDeckTrait(
            SynergyTrait.highTotalArmor, when {
                deck.totalArmor > 8 -> 4
                deck.totalArmor > 6 -> 3
                deck.totalArmor > 4 -> 2
                else -> 1
            }
        )

        if (deck.artifactCount > 4) traits.addDeckTrait(
            SynergyTrait.highArtifactCount, when {
                deck.artifactCount > 7 -> 4
                deck.artifactCount > 6 -> 3
                deck.artifactCount > 5 -> 2
                else -> 1
            }
        )

        if (deck.artifactCount < 4) traits.addDeckTrait(
            SynergyTrait.lowArtifactCount, when {
                deck.artifactCount < 1 -> 4
                deck.artifactCount < 2 -> 3
                deck.artifactCount < 3 -> 2
                else -> 1
            }
        )

        if (deck.upgradeCount > 0) traits.addDeckTrait(
            SynergyTrait.upgradeCount, when {
                deck.upgradeCount > 3 -> 4
                deck.upgradeCount > 2 -> 3
                deck.upgradeCount > 1 -> 2
                else -> 1
            }
        )

        if (deck.creatureCount > 18) traits.addDeckTrait(
            SynergyTrait.highCreatureCount, when {
                deck.creatureCount > 21 -> 4
                deck.creatureCount > 20 -> 3
                deck.creatureCount > 19 -> 2
                else -> 1
            }
        )

        if (deck.creatureCount < 17) traits.addDeckTrait(
            SynergyTrait.lowCreatureCount, when {
                deck.creatureCount < 14 -> 4
                deck.creatureCount < 15 -> 3
                deck.creatureCount < 16 -> 2
                else -> 1
            }
        )
    }
}

data class SynMatchInfo(
    var matches: Map<TraitStrength, Int>,
    var cardNames: List<String> = listOf()
)

data class SynTraitValueWithHouse(
    val value: SynTraitValue,
    val card: Card?,
    val house: House?,
    val deckTrait: Boolean
)

fun MutableMap<SynergyTrait, SynTraitValuesForTrait>.addTrait(
    traitValue: SynTraitValue,
    card: Card?,
    house: House?,
    deckTrait: Boolean = false
) {
    if (!this.containsKey(traitValue.trait)) {
        this[traitValue.trait] = SynTraitValuesForTrait()
    }
    this[traitValue.trait]!!.traitValues.add(SynTraitValueWithHouse(traitValue, card, house, deckTrait))
}

fun MutableMap<SynergyTrait, SynTraitValuesForTrait>.addDeckTrait(
    trait: SynergyTrait,
    count: Int,
    house: House? = null,
    traitHouse: SynTraitHouse = SynTraitHouse.anyHouse,
    strength: TraitStrength = TraitStrength.NORMAL
) {
    repeat(count) {
        this.addTrait(SynTraitValue(trait, strength.value, traitHouse), null, house, true)
    }
}

data class SynTraitValuesForTrait(
    val traitValues: MutableList<SynTraitValueWithHouse> = mutableListOf()
) {

    companion object {
        private val log = LoggerFactory.getLogger(this::class.java)
    }

    fun matches(card: Card, synergyValue: SynTraitValue): SynMatchInfo {
        val house = card.house
        val cardName = card.cardTitle

        // log.info("Check if there is a match for card ${card.cardTitle} in trait values ${ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(traitValues)}")

        val matchedTraits = traitValues
            .filter {
                val traitsCard = it.card
                val typeMatch =
                    typesMatch(it.value.trait, synergyValue.cardTypes, traitsCard?.allTypes(), it.value.cardTypes)
                val playerMatch = playersMatch(synergyValue.player, it.value.player)
                val houseMatch = housesMatch(synergyValue.house, house, it.value.house, it.house, it.deckTrait)
                val powerMatch = synergyValue.powerMatch(traitsCard?.power ?: -1, traitsCard?.cardType)
                // For matching traits on the synergy
                val synergyTraitsMatch =
                    traitsOnSynergyMatch(synergyValue.cardTraits, traitsCard?.traits, synergyValue.notCardTraits)
                // For matching traits on the trait
                val traitsTraitMatch = traitsOnTraitMatch(it.value.cardTraits, card.traits, it.value.notCardTraits)
                val match =
                    typeMatch && playerMatch && houseMatch && powerMatch && synergyTraitsMatch && traitsTraitMatch

                // log.debug("\ntrait ${synergyValue.trait} match $match\n ${it.value.trait} in ${it.card?.cardTitle ?: "Deck trait: ${it.deckTrait}"} \ntype $typeMatch player $playerMatch house $houseMatch power $powerMatch trait $traitMatch")

                match
            }

        var sameCard = false
        val cardNames = matchedTraits.mapNotNull {
            if (it.card?.cardTitle == cardName) {
                sameCard = true
            }
            it.card?.cardTitle
        }
        val strength = matchedTraits
            .groupBy { it.value.strength() }
            .map {
                it.key to if (sameCard && it.value.any { it.card?.cardTitle != null && it.card.cardTitle == cardName }) it.value.count() - 1 else it.value.count()
            }
            .toMap()
        return SynMatchInfo(strength, cardNames)
    }

    private fun typesMatch(
        traitTrait: SynergyTrait,
        synTypes: List<CardType>,
        cardTypes: Set<CardType>?,
        traitTypes: List<CardType>
    ): Boolean {
        return if (traitTrait == SynergyTrait.any) {
            synTypes.isEmpty() || synTypes.any { cardTypes?.contains(it) ?: false }
        } else {
            synTypes.isEmpty() || traitTypes.isEmpty() || synTypes.any { type1Type -> traitTypes.any { type1Type == it } }
        }
    }

    private fun playersMatch(player1: SynTraitPlayer, player2: SynTraitPlayer): Boolean {
        return player1 == SynTraitPlayer.ANY || player2 == SynTraitPlayer.ANY || player1 == player2
    }

    private fun traitsOnSynergyMatch(
        synergyTraits: Collection<String>,
        cardTraits: Collection<String>?,
        nonMatchOnly: Boolean
    ): Boolean {
        // log.info("In traits match syn traits $synergyTraits cardTraits $cardTraits")
        return synergyTraits.isEmpty() || (cardTraits != null && synergyTraits.all {
            val hasMatch = cardTraits.contains(it)
            if (nonMatchOnly) !hasMatch else hasMatch
        })
    }

    private fun traitsOnTraitMatch(
        synergyTraits: Collection<String>,
        cardTraits: Collection<String>?,
        nonMatchOnly: Boolean
    ): Boolean {
        // log.info("In traits match syn traits $synergyTraits cardTraits $cardTraits")
        return synergyTraits.isEmpty() || (cardTraits != null && synergyTraits.all {
            val hasMatch = cardTraits.contains(it)
            if (nonMatchOnly) !hasMatch else hasMatch
        })
    }

    private fun housesMatch(
        synHouse: SynTraitHouse,
        house1: House,
        traitHouse: SynTraitHouse,
        house2: House?,
        deckTrait: Boolean = false
    ): Boolean {
        return when (synHouse) {
            SynTraitHouse.anyHouse -> when (traitHouse) {
                // any house with any house always true
                SynTraitHouse.anyHouse -> true
                SynTraitHouse.house -> !deckTrait && house1 == house2
                SynTraitHouse.outOfHouse -> !deckTrait && house1 != house2
                SynTraitHouse.continuous -> true
            }

            SynTraitHouse.house -> when (traitHouse) {
                SynTraitHouse.anyHouse -> !deckTrait && house1 == house2
                SynTraitHouse.house -> house1 == house2
                // out of house with in house always false
                SynTraitHouse.outOfHouse -> false
                SynTraitHouse.continuous -> true
            }

            SynTraitHouse.outOfHouse -> when (traitHouse) {
                SynTraitHouse.anyHouse -> !deckTrait && house1 != house2
                // out of house with in house always false
                SynTraitHouse.house -> false
                SynTraitHouse.outOfHouse -> house1 != house2
                SynTraitHouse.continuous -> true
            }
            // Synergies with omni always match
            SynTraitHouse.continuous -> true
        }
    }
}

data class SynergizedValue(val value: Double, val synergy: Double)

fun Double?.isZeroOrNull() = this == null || this.roundToTwoSigDig() == 0.0
