package coraythan.keyswap.synergy.synergysystem

import coraythan.keyswap.cards.CardType
import coraythan.keyswap.synergy.SynTraitHouse
import coraythan.keyswap.synergy.SynTraitPlayer
import coraythan.keyswap.synergy.SynergyTrait

object MetaScoreAlgorithm {
    fun generateMetaScores(aemberControl: Double, creatureControl: Double, traitsMap: Map<SynergyTrait, MatchSynergiesToTraits>): Map<String, Double> {
        val scalingAemberControlTraits =
            traitsMap[SynergyTrait.scalingAmberControl]?.traitValues?.sumOf { it.value.strength().value } ?: 0
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

        val hardRScore = artifactDestroyTraits.plus(artifactPurgeTraits).sumOf { it.value.rating }
        val boardWipeScore =
            traitsMap[SynergyTrait.boardClear]?.traitValues?.sumOf { it.value.strength().value } ?: 0

        val boardWipeScoreByHouse =
            traitsMap[SynergyTrait.boardClear]?.traitValues
                ?.filter { it.house != null }
                ?.groupBy { it.house!! }
                ?.map { it.key to it.value.sumOf { synTraitValueWithHouse ->
                    if (synTraitValueWithHouse.value.house != SynTraitHouse.continuous) {
                        synTraitValueWithHouse.value.rating
                    } else {
                        // Skip omni for single-house wipe score
                        0
                    }
                } }
                ?.toMap() ?: mapOf()
        val houseTooHigh = boardWipeScoreByHouse.any { it.value > 9 }

        val boardClearsValue = if (houseTooHigh && boardWipeScore < 18) {
            "Board Clears For House" to -2.0
        } else {
            "Board Clears" to when {
                boardWipeScore < 3 -> -2.0
                boardWipeScore < 5 -> -1.0
                boardWipeScore > 18 -> -3.0
                boardWipeScore > 15 -> -2.0
                boardWipeScore > 12 -> -1.0
                else -> 0.0
            }
        }

        return mapOf<String, Double>(
            "Aember Control" to when {
                aemberControl < 2 -> -4.0
                aemberControl < 3 -> -3.0
                aemberControl < 4 -> -2.0
                aemberControl < 5 -> -1.0
                else -> 0.0
            },
            "Creature Control" to when {
                creatureControl < 2 -> -4.0
                creatureControl < 4 -> -3.0
                creatureControl < 6 -> -2.0
                creatureControl < 7 -> -1.0
                else -> 0.0
            },
            "Artifact Control" to when {
                hardRScore > 2 -> 1.0
                else -> 0.0
            },
            boardClearsValue,
            "Scaling Aember Control" to when {
                scalingAemberControlTraits > 2 -> 1.0
                else -> 0.0
            },
        )
    }
}