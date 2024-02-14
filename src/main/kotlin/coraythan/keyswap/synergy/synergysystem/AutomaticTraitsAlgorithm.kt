package coraythan.keyswap.synergy.synergysystem

import coraythan.keyswap.cards.dokcards.DokCardInDeck
import coraythan.keyswap.synergy.SynTraitValue
import coraythan.keyswap.synergy.SynergyTrait

object AutomaticTraitsAlgorithm {
    fun addAutomaticTraits(
        traits: MutableMap<SynergyTrait, MatchSynergiesToTraits>,
        cards: List<DokCardInDeck>
    ) {
        // High value traits
        cards
            .filter {
                it.extraCardInfo.aercScoreAverage >= 2.5
            }
            .forEach { card ->
                traits.addTrait(
                    traitValue = SynTraitValue(
                        trait = SynergyTrait.highValue,
                        rating = when {
                            card.extraCardInfo.aercScoreAverage >= 3.5 -> 4
                            card.extraCardInfo.aercScoreAverage >= 3.0 -> 3
                            card.extraCardInfo.aercScoreAverage >= 2.5 -> 2
                            else -> 0
                        },
                        cardTypes = card.extraCardInfo.allCardTypes().toList()
                    ),
                    card = card,
                    house = card.house,
                    deckTrait = false,
                )
            }
    }
}