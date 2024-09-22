package coraythan.keyswap.synergy.synergysystem

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.decks.models.GenericDeck
import coraythan.keyswap.synergy.*
import kotlin.math.roundToInt

private data class TraitVals(
    val maxDeck: Int,
    val maxHouse: Int,
    val minDeck: Int = 0,
    val minHouse: Int = 0,
)

data class DeckSynergyStats(
    val deckStats: Map<SynergyTrait, Int>,
    val deckStatsFriendly: Map<SynergyTrait, Int>,
    val deckStatsEnemy: Map<SynergyTrait, Int>,
    val houseStats: Map<House, Map<SynergyTrait, Int>>,
    val houseStatsFriendly: Map<House, Map<SynergyTrait, Int>>,
    val houseStatsEnemy: Map<House, Map<SynergyTrait, Int>>,
) {
    companion object {

        private val bonusIconBaseTraitStrengths = TraitVals(30, 10)

        private val traits = mapOf(
            SynergyTrait.creatureCount to TraitVals(25, 10, 11, 3),
            SynergyTrait.tokenCount to TraitVals(25, 25),
            SynergyTrait.bonusAmber to bonusIconBaseTraitStrengths,
            SynergyTrait.bonusCapture to bonusIconBaseTraitStrengths,
            SynergyTrait.bonusDamage to bonusIconBaseTraitStrengths,
            SynergyTrait.bonusDraw to bonusIconBaseTraitStrengths,
            SynergyTrait.bonusDiscard to bonusIconBaseTraitStrengths,
            SynergyTrait.totalCreaturePower to TraitVals(100, 30, 30, 15),
            SynergyTrait.totalArmor to TraitVals(10, 5),
            SynergyTrait.haunted to (TraitVals(100, 0)),
            SynergyTrait.expectedAember to TraitVals(30, 12, 10, 3),
            SynergyTrait.capturedAmber to TraitVals(16, 8),
            SynergyTrait.targettedCapturedAmber to TraitVals(16, 8),
        )

        private fun matches(trait: SynergyTrait) = traits.keys.contains(trait)

        fun createStats(
            deck: GenericDeck,
            inputCards: List<DokCardInDeck>,
            tokenValues: TokenValues?
        ): DeckSynergyStats {
            return DeckSynergyStats(
                deckStats = statsFromCards(inputCards, tokenValues?.tokensPerGame?.roundToInt() ?: 0, SynTraitPlayer.ANY),
                deckStatsFriendly = statsFromCards(inputCards, tokenValues?.tokensPerGame?.roundToInt() ?: 0, SynTraitPlayer.FRIENDLY),
                deckStatsEnemy = statsFromCards(inputCards, tokenValues?.tokensPerGame?.roundToInt() ?: 0, SynTraitPlayer.ENEMY),
                houseStats = deck.houses.associateWith {
                    statsFromCards(
                        inputCards.filter { card -> card.house == it },
                        tokenValues?.tokensPerGamePerHouse?.get(it)?.roundToInt() ?: 0, SynTraitPlayer.ANY
                    )
                },
                houseStatsFriendly = deck.houses.associateWith {
                    statsFromCards(
                        inputCards.filter { card -> card.house == it },
                        tokenValues?.tokensPerGamePerHouse?.get(it)?.roundToInt() ?: 0, SynTraitPlayer.FRIENDLY
                    )
                },
                houseStatsEnemy = deck.houses.associateWith {
                    statsFromCards(
                        inputCards.filter { card -> card.house == it },
                        tokenValues?.tokensPerGamePerHouse?.get(it)?.roundToInt() ?: 0, SynTraitPlayer.ENEMY
                    )
                },
            )
        }

        private fun statsFromCards(inputCards: List<DokCardInDeck>, tokensCount: Int, player: SynTraitPlayer): Map<SynergyTrait, Int> {
            val capturePips = inputCards.sumOf { it.bonusCapture }
            return mapOf(
                SynergyTrait.creatureCount to inputCards.count {
                    it.card.cardType == CardType.Creature || it.card.cardType == CardType.TokenCreature || it.extraCardInfo.extraCardTypes?.contains(
                        CardType.Creature
                    ) == true
                },
                SynergyTrait.bonusAmber to inputCards.sumOf { it.card.amber + it.bonusAember },
                SynergyTrait.bonusCapture to capturePips,
                SynergyTrait.bonusDamage to inputCards.sumOf { it.bonusDamage },
                SynergyTrait.bonusDraw to inputCards.sumOf { it.bonusDraw },
                SynergyTrait.bonusDiscard to inputCards.sumOf { it.bonusDiscard },
                SynergyTrait.totalCreaturePower to inputCards.sumOf { card ->
                    val increasesPowerTrait = card.extraCardInfo.traits.firstOrNull { it.trait == SynergyTrait.increasesCreaturePower && it.player != SynTraitPlayer.ENEMY }
                    card.card.power + (if (increasesPowerTrait == null) 0 else when (increasesPowerTrait.rating) {
                        TraitStrength.EXTRA_WEAK.value -> 1
                        TraitStrength.WEAK.value -> 2
                        TraitStrength.NORMAL.value -> 3
                        TraitStrength.STRONG.value -> 4
                        TraitStrength.EXTRA_STRONG.value -> 6
                        else -> 0
                    })
                                                                    },
                SynergyTrait.tokenCount to tokensCount,
                SynergyTrait.totalArmor to inputCards.sumOf { it.card.armor },
                SynergyTrait.expectedAember to inputCards.sumOf {
                    val max = it.extraCardInfo.expectedAmberMax ?: 0.0
                    val min = it.extraCardInfo.expectedAmber
                    if (max == 0.0) min else (min + max) / 2
                }.roundToInt(),

                SynergyTrait.haunted to calculateHauntingPercent(inputCards, player),
                SynergyTrait.capturedAmber to calculateCapturePercentWithTraits(
                    inputCards, capturePips, setOf(SynergyTrait.capturesAmber, SynergyTrait.exalt), player
                ),
                SynergyTrait.targettedCapturedAmber to calculateCapturePercentWithTraits(
                    inputCards, capturePips, setOf(SynergyTrait.putsAmberOnTarget), player
                ),
            )
        }

        private fun calculateCapturePercentWithTraits(
            cards: List<DokCardInDeck>, capturePips: Int, checkTraits: Set<SynergyTrait>, target: SynTraitPlayer = SynTraitPlayer.ANY
        ): Int {
            val friendlyIncluded = target == SynTraitPlayer.ANY || target == SynTraitPlayer.FRIENDLY

            val captureScore = cards.sumOf { dokCardInDeck ->
                val traits = dokCardInDeck.extraCardInfo.traits

                val capTrait = traits.firstOrNull {
                    val traitMatch = checkTraits.contains(it.trait)
                    val playerMatch = target == SynTraitPlayer.ANY || it.player == SynTraitPlayer.ANY || target == it.player
                    traitMatch && playerMatch
                }

                if (capTrait == null) {
                    0.0
                } else {
                    when (capTrait.strength()) {
                        TraitStrength.EXTRA_WEAK -> 0.5
                        TraitStrength.WEAK -> 1.0
                        TraitStrength.NORMAL -> 2.0
                        TraitStrength.STRONG -> 3.0
                        TraitStrength.EXTRA_STRONG -> 4.0
                    }
                }
            }

            return (if (friendlyIncluded) capturePips else  0) + captureScore.roundToInt()
        }

        private fun calculateHauntingPercent(cards: List<DokCardInDeck>, target: SynTraitPlayer = SynTraitPlayer.ANY): Int {
            val friendlyIncluded = target == SynTraitPlayer.ANY || target == SynTraitPlayer.FRIENDLY
            val hauntingScore = cards.sumOf { dokCardInDeck ->
                val traitValues = dokCardInDeck.extraCardInfo.traits.sumOf {
                    val playerMatch = target == SynTraitPlayer.ANY || it.player == SynTraitPlayer.ANY || target == it.player
                    val millsOrHauntingTrait =
                        if ((it.trait == SynergyTrait.mills || it.trait == SynergyTrait.haunted) && playerMatch) {
                            when (it.strength()) {
                                TraitStrength.EXTRA_WEAK -> 5
                                TraitStrength.WEAK -> 10
                                TraitStrength.NORMAL -> 15
                                TraitStrength.STRONG -> 20
                                TraitStrength.EXTRA_STRONG -> 30
                            }
                        } else {
                            0
                        }

                    val discards =
                        if (
                            (it.trait == SynergyTrait.discardsCards || it.trait == SynergyTrait.discardsFromDeck)
                            && playerMatch
                        ) {

                            when (it.strength()) {
                                TraitStrength.EXTRA_WEAK -> 4
                                TraitStrength.WEAK -> 6
                                TraitStrength.NORMAL -> 8
                                TraitStrength.STRONG -> 12
                                TraitStrength.EXTRA_STRONG -> 16
                            }
                        } else {
                            0
                        }

                    millsOrHauntingTrait + discards
                }

                val artifact = if (dokCardInDeck.card.cardType == CardType.Artifact && friendlyIncluded) -5 else 0
                val action = if (dokCardInDeck.card.cardType == CardType.Action && friendlyIncluded) 2 else 0
                val discardPips = if (friendlyIncluded) dokCardInDeck.bonusDiscard * 4 else 0
                traitValues + artifact + action + discardPips
            }

            return hauntingScore
        }
    }

    fun synPercent(trait: SynTraitValue, house: House): Int? {
        if (!matches(trait.trait)) return null

        val vals = traits[trait.trait] ?: return 0
        val multiplier = when (trait.rating) {
            4 -> 2.0
            3 -> 1.0
            2 -> 0.5
            1 -> 0.25
            -1 -> -0.25
            -2 -> -0.5
            -3 -> -1.0
            -4 -> -2.0
            else -> throw IllegalStateException("Bad rating ${trait.rating} $trait")
        }

        val relevantHouseStats = when (trait.player) {
            SynTraitPlayer.ANY -> houseStats
            SynTraitPlayer.FRIENDLY -> houseStatsFriendly
            SynTraitPlayer.ENEMY -> houseStatsEnemy
        }

        when (trait.house) {

            // Checking for in house
            SynTraitHouse.house -> {
                val actual = relevantHouseStats[house]?.get(trait.trait)?.toDouble() ?: return 0
                return calculatePercent(actual, vals.minHouse.toDouble(), vals.maxHouse.toDouble(), multiplier)
            }

            // Checking for deck trait
            SynTraitHouse.anyHouse -> {
                val relevantDeckStats = when (trait.player) {
                    SynTraitPlayer.ANY -> deckStats
                    SynTraitPlayer.FRIENDLY -> deckStatsFriendly
                    SynTraitPlayer.ENEMY -> deckStatsEnemy
                }
                val actual = relevantDeckStats[trait.trait]?.toDouble() ?: return 0
                return calculatePercent(actual, vals.minDeck.toDouble(), vals.maxDeck.toDouble(), multiplier)
            }

            // Checking for out of house trait
            else -> {
                val actual = relevantHouseStats.filter { it.key != house }
                    .values.sumOf { it[trait.trait]?.toDouble() ?: 0.0 }
                return calculatePercent(
                    actual,
                    (vals.minHouse * 2).toDouble(),
                    (vals.maxHouse.toDouble() * 2),
                    multiplier
                )
            }
        }
    }

    private fun calculatePercent(actual: Double, min: Double, max: Double, multiplier: Double): Int {
        val range = max - min
        val actualMinusMin = actual - min
        val synPercent = (actualMinusMin * 100.0) / range
        val finalPercent = synPercent * multiplier
        // println("Inputs $actual $min $max $divisor $finalPercent")
        return finalPercent.roundToInt()
    }
}
