package coraythan.keyswap.synergy.synergysystem

import coraythan.keyswap.House
import coraythan.keyswap.cards.CardType
import coraythan.keyswap.decks.models.CardWithBonusIcons
import coraythan.keyswap.decks.models.GenericDeck
import coraythan.keyswap.synergy.SynTraitHouse
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait
import kotlin.math.roundToInt

private data class TraitVals(
    val maxDeck: Int,
    val maxHouse: Int,
    val minDeck: Int = 0,
    val minHouse: Int = 0,
)

data class DeckSynergyStats(
    val deckStats: Map<SynergyTrait, Int>,
    val houseStats: Map<House, Map<SynergyTrait, Int>>,

    ) {
    companion object {

        private val bonusIconBaseTraitStrengths = TraitVals(30, 10)

        private val traits = mapOf(
            SynergyTrait.creatureCount to TraitVals(25, 10, 15, 3),
            SynergyTrait.tokenCount to TraitVals(25, 25),
            SynergyTrait.bonusAmber to bonusIconBaseTraitStrengths,
            SynergyTrait.bonusCapture to bonusIconBaseTraitStrengths,
            SynergyTrait.bonusDamage to bonusIconBaseTraitStrengths,
            SynergyTrait.bonusDraw to bonusIconBaseTraitStrengths,
            SynergyTrait.totalCreaturePower to TraitVals(90, 30, 45, 15),
            SynergyTrait.totalArmor to TraitVals(10, 5)
        )

        private fun matches(trait: SynergyTrait) = traits.keys.contains(trait)

        fun createStats(deck: GenericDeck, inputCards: List<CardWithBonusIcons>, tokenValues: TokenValues?): DeckSynergyStats {
            return DeckSynergyStats(
                deckStats = statsFromCards(inputCards, tokenValues?.tokensPerGame?.roundToInt() ?: 0),
                houseStats = deck.houses.associateWith {
                    statsFromCards(
                        inputCards.filter { card -> card.card.house == it },
                        tokenValues?.tokensPerGamePerHouse?.get(it)?.roundToInt() ?: 0
                    )
                },
            )
        }

        private fun statsFromCards(inputCards: List<CardWithBonusIcons>, tokensCount: Int): Map<SynergyTrait, Int> {
            return mapOf(
                SynergyTrait.creatureCount to inputCards.sumBy { if (it.card.cardType == CardType.Creature || it.card.cardType == CardType.TokenCreature) 1 else 0 },
                SynergyTrait.bonusAmber to inputCards.sumBy { it.card.amber + it.bonusAember },
                SynergyTrait.bonusCapture to  inputCards.sumBy { it.bonusCapture },
                SynergyTrait.bonusDamage to  inputCards.sumBy { it.bonusDamage },
                SynergyTrait.bonusDraw to  inputCards.sumBy { it.bonusDraw },
                SynergyTrait.totalCreaturePower to  inputCards.sumBy { it.card.power },
                SynergyTrait.tokenCount to  tokensCount,
                SynergyTrait.totalArmor to inputCards.sumBy { it.card.armor }
            )
        }
    }

    fun synPercent(trait: SynTraitValue, house: House): Int? {
        if (!matches(trait.trait)) return null

        val vals = traits[trait.trait] ?: return 0
        val divisor = when (trait.rating) {
            4 -> 2.0
            3 -> 1.0
            2 -> 0.5
            1 -> 0.25
            else -> throw IllegalStateException("Bad rating ${trait.rating} $trait")
        }

        when (trait.house) {
            SynTraitHouse.house -> {
                val actual = houseStats[house]?.get(trait.trait)?.toDouble() ?: return 0
                return calculatePercent(actual, vals.minHouse.toDouble(), vals.maxHouse.toDouble(), divisor)
            }
            SynTraitHouse.anyHouse -> {
                val actual = deckStats[trait.trait]?.toDouble() ?: return 0
                return calculatePercent(actual, vals.minDeck.toDouble(), vals.maxDeck.toDouble(), divisor)
            }
            else -> {
                val actual = houseStats.filter { it.key != house }
                    .values.sumByDouble { it[trait.trait]?.toDouble() ?: 0.0 }
                return calculatePercent(actual, (vals.minHouse * 2).toDouble(), (vals.maxHouse.toDouble() * 2), divisor)
            }
        }
    }

    private fun calculatePercent(actual: Double, min: Double, max: Double, divisor: Double): Int {
        val range = max - min
        val actualMinusMin = actual - min
        val synPercent = (actualMinusMin * 100.0) / range
        val finalPercent = synPercent / divisor
        println("Inputs $actual $min $max $divisor $finalPercent")
        return finalPercent.roundToInt()
    }

}
