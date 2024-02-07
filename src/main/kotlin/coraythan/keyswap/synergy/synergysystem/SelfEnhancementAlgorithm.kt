package coraythan.keyswap.synergy.synergysystem

import coraythan.keyswap.cards.CardType
import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyCombo
import coraythan.keyswap.synergy.SynergyMatch
import coraythan.keyswap.synergy.SynergyTrait

object SelfEnhancementAlgorithm {
    fun generateSelfEnhancementCombos(cards: List<DokCardInDeck>): List<SynergyCombo> {
        return cards
            .mapNotNull { cardWithIcons ->
                val card = cardWithIcons.card
                val trait = cardWithIcons.extraCardInfo.traits.firstOrNull { it.trait == SynergyTrait.replaysSelf }
                    ?: cardWithIcons.extraCardInfo.traits.firstOrNull { it.trait == SynergyTrait.dangerousRandomPlay }
                    ?: cardWithIcons.extraCardInfo.traits.firstOrNull { it.trait == SynergyTrait.scrapValue }
                val comboTrait: SynTraitValue?
                val multiplier = when {
                    trait?.trait == SynergyTrait.replaysSelf -> {
                        comboTrait = trait
                        when (trait.rating) {
                            4 -> 3.0
                            3 -> 2.0
                            2 -> 1.5
                            else -> 1.25
                        }
                    }

                    trait?.trait == SynergyTrait.dangerousRandomPlay -> {
                        comboTrait = trait
                        when (trait.rating) {
                            4 -> 0.0
                            3 -> 0.25
                            2 -> 0.5
                            else -> 0.75
                        }
                    }

                    trait?.trait == SynergyTrait.scrapValue -> {
                        comboTrait = trait
                        when (trait.rating) {
                            4 -> 0.25
                            3 -> 0.5
                            2 -> 0.75
                            else -> 0.95
                        }
                    }

                    card.cardType == CardType.Artifact -> {
                        comboTrait = SynTraitValue(
                            trait = SynergyTrait.any,
                            cardTypes = listOf(CardType.Artifact),
                        )
                        0.75
                    }

                    else -> {
                        comboTrait = null
                        null
                    }
                }

                if (multiplier == null) {
                    null
                } else {
                    val drawPipsMod = calculateModifier(cardWithIcons.bonusDraw, StaticAercValues.draw, multiplier)
                    val discardPipsMod =
                        calculateModifier(cardWithIcons.bonusDiscard, StaticAercValues.discard, multiplier)
                    val amberMod = calculateModifier(cardWithIcons.bonusAember, StaticAercValues.amber, multiplier)
                    val amberControlMod =
                        calculateModifier(cardWithIcons.bonusCapture, StaticAercValues.capture, multiplier)
                    val creatureControlMod =
                        calculateModifier(cardWithIcons.bonusDamage, StaticAercValues.damage, multiplier)
                    val total = drawPipsMod + amberMod + amberControlMod + creatureControlMod + discardPipsMod

                    SynergyCombo(
                        house = cardWithIcons.house,
                        cardName = card.cardTitle + " Enhanced",
                        synergies = if (comboTrait == null) listOf() else listOf(SynergyMatch(comboTrait, 100, setOf())),
                        netSynergy = total,
                        aercScore = total,

                        amberControl = amberControlMod,
                        expectedAmber = amberMod,
                        artifactControl = 0.0,
                        creatureControl = creatureControlMod,
                        efficiency = drawPipsMod + discardPipsMod,
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