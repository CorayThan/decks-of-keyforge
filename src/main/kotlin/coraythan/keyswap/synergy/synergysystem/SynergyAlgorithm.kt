package coraythan.keyswap.synergy.synergysystem

import com.google.common.math.DoubleMath.roundToInt
import coraythan.keyswap.House
import coraythan.keyswap.cards.Card
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.decks.models.GenericDeck
import coraythan.keyswap.decks.models.withBonusIcons
import coraythan.keyswap.roundToTwoSigDig
import coraythan.keyswap.synergy.*
import coraythan.keyswap.synergy.synergysystem.GenerateDeckAndHouseTraits.addDeckTraits
import coraythan.keyswap.synergy.synergysystem.GenerateDeckAndHouseTraits.addHouseTraits
import coraythan.keyswap.synergy.synergysystem.GenerateDeckAndHouseTraits.addOutOfHouseTraits
import coraythan.keyswap.synergy.synergysystem.MetaScoreAlgorithm.generateMetaScores
import coraythan.keyswap.synergy.synergysystem.TokenSynergyService.makeTokenValues
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

    fun fromDeckWithCards(deck: GenericDeck, inputCards: List<Card>, token: Card? = null): DeckSynergyInfo {

        val cardsNoToken = if (inputCards.any { it.big == true }) {
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

        val tokenValues = makeTokenValues(cardsNoToken, token)

        val cards: List<Card> = cardsNoToken
            .let {
                if (token == null) it else it.plus(
                    (0..(tokenValues?.tokensPerGame?.roundToInt() ?: 0)).map { token })
            }
        val cardsWithBonusIcons = cards.withBonusIcons(deck.bonusIcons())
        val deckStats = DeckSynergyStats.createStats(deck, cardsWithBonusIcons, tokenValues)

        val traitsMap = mutableMapOf<SynergyTrait, MatchSynergiesToTraits>()

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
                val card = cardsById.value[0]
                val count = cardsById.value.size
                val cardInfo = card.extraCardInfo ?: error("Oh no, ${card.cardTitle} had null extra info! $card")

                val matchedTraits: Map<String?, List<SynergyMatch>> = cardInfo.synergies
                    .map { synergy ->

                        val synergyTrait = synergy.trait
                        val cardNames = mutableSetOf<String>()

                        // First check if the synergy matches a deck stat. If not then calculate a cards based trait
                        val synPercent = deckStats.synPercent(synergy, cardsById.key.second)
                            ?: TraitStrength.values().sumOf { strength ->
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
                            }

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

        val creatureCount =
            cards.filter { it.cardType == CardType.Creature }.size + (if (tokenValues == null) 0 else tokenValues.tokensPerGame.roundToInt())
        val powerValue = p.toDouble() / 10.0

        // Remember! When updating this also update Card
        val synergyUnroundedRaw = synergyCombos.filter { it.netSynergy > 0 }.map { it.netSynergy * it.copies }.sum()

        val antiSynergyToRound = synergyCombos.filter { it.netSynergy < 0 }.map { it.netSynergy * it.copies }.sum()
        val antisynergy = roundToInt(antiSynergyToRound, RoundingMode.HALF_UP).absoluteValue
        val preMetaSas = a + e + r + c + f + u + d + cp + o + powerValue + (creatureCount.toDouble() * 0.4)

        val efficiencyBonus = calculateEfficiencyBonus(synergyCombos, preMetaSas)

        val metaScores = generateMetaScores(a, c, traitsMap)
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
            tokenCreationValues = if (tokenValues == null) null else TokenCreationValues(
                tokensPerGame = tokenValues.tokensPerGame,
                tokensPerHouse = tokenValues.tokensPerGamePerHouse.map { TokensPerGameForHouse(it.key, it.value) },
            )
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


}

data class SynergizedValue(val value: Double, val synergy: Double)

fun Double?.isZeroOrNull() = this == null || this.roundToTwoSigDig() == 0.0
