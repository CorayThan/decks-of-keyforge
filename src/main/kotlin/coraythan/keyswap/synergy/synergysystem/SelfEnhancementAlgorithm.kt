package coraythan.keyswap.synergy.synergysystem

import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.synergy.SynergyCombo
import coraythan.keyswap.synergy.SynergyMatch
import coraythan.keyswap.synergy.SynergyTrait

object SelfEnhancementAlgorithm {
    fun generateSelfEnhancementCombos(cards: List<DokCardInDeck>): List<SynergyCombo> {
        return cards
            .filter { card ->
                card.enhanced && card.extraCardInfo.traits.any { trait ->
                    trait.trait == SynergyTrait.dangerousRandomPlay || trait.trait == SynergyTrait.replaysSelf
                }
            }
            .mapNotNull { cardWithIcons ->
                val card = cardWithIcons.card
                val trait = cardWithIcons.extraCardInfo.traits.firstOrNull { it.trait == SynergyTrait.replaysSelf }
                    ?: cardWithIcons.extraCardInfo.traits.firstOrNull { it.trait == SynergyTrait.dangerousRandomPlay }
                if (trait == null) null else {
                    val multiplier = if (trait.trait == SynergyTrait.replaysSelf) {
                        when (trait.rating) {
                            4 -> 3.0
                            3 -> 2.0
                            2 -> 1.0
                            else -> 1.25
                        }
                    } else {
                        when (trait.rating) {
                            4 -> 0.0
                            3 -> 0.25
                            2 -> 0.5
                            else -> 0.75
                        }
                    }

                    val efficiencyMod = calculateModifier(cardWithIcons.bonusDraw, StaticAercValues.draw, multiplier)
                    val amberMod = calculateModifier(cardWithIcons.bonusAember, StaticAercValues.amber, multiplier)
                    val amberControlMod = calculateModifier(cardWithIcons.bonusCapture, StaticAercValues.capture, multiplier)
                    val creatureControlMod = calculateModifier(cardWithIcons.bonusDamage, StaticAercValues.damage, multiplier)
                    val total = efficiencyMod + amberMod + amberControlMod + creatureControlMod

                    SynergyCombo(
                        house = cardWithIcons.house,
                        cardName = card.cardTitle + " Enhanced",
                        synergies = listOf(SynergyMatch(trait, 100, setOf())),
                        netSynergy = total,
                        aercScore = total,

                        amberControl = amberControlMod,
                        expectedAmber = amberMod,
                        artifactControl = 0.0,
                        creatureControl = creatureControlMod,
                        efficiency = efficiencyMod,
                        recursion = 0.0,
                        effectivePower = 0,

                        disruption = 0.0,
                        creatureProtection = 0.0,
                        other = 0.0,
                        copies = 1,

                        notCard = true,
                    )
                }
            }
    }

    private fun calculateModifier(pips: Int, pipVal: Double, multiplier: Double): Double {
        val base = pips * pipVal
        val multiplied = base * multiplier
        return multiplied - base
    }
}